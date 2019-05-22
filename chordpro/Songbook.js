import { Song } from './Song'
import {ucfirst} from 'ucfirst'

// Parser context
var defContext = ''
var inContext = defContext
var gridArg, gridCells

// Locel transposition
var xpose = 0

var usedChords = []

var chorus = [], chorusXpose = 0

var reChords, $reMeta
var labels = []

// Current song
var song

export class Songbook {

  constructor () {
    this.songs = []
    reChords = /(\[.*?\])/
    this.diag = {}
  }

  // line 82
  parseSong(lines, linecnt, options) {

    // TODO
    /* $no_transpose = $options->{'no-transpose'};
    $no_substitute = $options->{'no-substitute'};
    $decapo = $options->{decapo} || $::config->{settings}->{decapo}; */

    song = new Song()

    /* $song = App::Music::ChordPro::Song->new
      ( source => { file => $diag->{file}, line => 1 + $$linecnt },
	system => App::Music::ChordPro::Chords::get_parser,
	structure => "linear",
      ); */

    let xpose = 0, gridArg = [ 4, 4, 1, 1], inContext = defContext, usedChords = [], warnedChords = {}, memChords = {}
    //    App::Music::ChordPro::Chords::reset_song_chords();
    let labels = []

/*     # Pre-fill meta data, if any.
    if ( $options->{meta} ) {
	while ( my ($k, $v ) = each( %{ $options->{meta} } ) ) {
	    $song->{meta}->{$k} = [ $v ];
	}
    } */
    
    // line 112
/*    # Build regexp to split out chords.
     if ( $::config->{settings}->{memorize} ) {
      $re_chords = qr/(\[.*?\]|\^)/;
        }
        else {
      $re_chords = qr/(\[.*?\])/;
        } */
    reChords = /(\[.*?\])/
/*     # Build regex for the known metadata items.
    if ( $::config->{metadata}->{keys} ) {
	$re_meta = '^(' .
	  join( '|', map { quotemeta } @{$::config->{metadata}->{keys}} )
	    . ')$';
	$re_meta = qr/$re_meta/;
    }
    else {
	# HUH?
	undef $re_meta;
    } */
    while (lines.length > 0) {
      diag.line = ++linecnt
      diag.orig = lines.shift();
      let current = diag.orig;
        /*if ( /^\s*\{(new_song|ns)\}\s*$/ ) {
          last if $song->{body};
          next;
      }
    
      if ( /^#/ ) {
          if ( /^##image:\s+id=(\S+)/ ) {
        my $id = $1;
    
        # In-line image asset.
        require MIME::Base64;
        require Image::Info;
    
        # Read the image.
        my $data = '';
        while ( @$lines && $lines->[0] =~ /^# (.+)/ ) {
            $data .= MIME::Base64::decode($1);
            shift(@$lines);
        }
    
        # Get info.
        my $info = Image::Info::image_info(\$data);
        if ( $info->{error} ) {
            do_warn($info->{error});
            next;
        }
    
        # Store in assets.
        $song->{assets} //= {};
        $song->{assets}->{$id} =
          { data => $data, type => $info->{file_ext},
            width => $info->{width}, height => $info->{height},
          };
    
        next;
          }
          # Collect pre-title stuff separately.
          if ( exists $song->{title} ) {
        $self->add( type => "ignore", text => $_ );
          }
          else {
        push( @{ $song->{preamble} }, $_ );
          }
          next;
        } */   

        //# For practical reasons: a prime should always be an apostroph.
        //s/'/\x{2019}/g;

      if(/^\s*\{(.*)\}\s*$/.exec(current)) {
        if(options.legacy) {
          this.add('ignore', current)
        }
        else {
          
        }
          /* $self->add( type => "ignore",
          text => $_ )
            unless
          $options->{_legacy}
            ? $self->global_directive( $1, $options, 1 )
            : $self->directive( $1, $options );
          next; */
          continue
      }

      if (inContext == 'tab') {
  /*         $self->add( type => "tabline", text => $_ );
          next; */
      }

      if (inContext == 'grid') {
  /*         $self->add( type => "gridline", $self->decompose_grid($_) );
          next; */
      }
      
      if(/\S/.exec(current)) {
        this.add('songline', this.decompose(current))
      }
      else if(this.song.title) {
        this.add('empty')
      }
      else {
        song.preamble = current
      }
    }
    console.warn(`Unterminated context in song: ${inContext}`);
    
    if(labels.length > 0) {
      song.labels = labels
    }

/*     my $diagrams;
    if ( exists($song->{settings}->{diagrams} ) ) {
	$diagrams = $song->{settings}->{diagrams};
	$diagrams &&= $::config->{diagrams}->{show} || "all";
    }
    else {
	$diagrams = $::config->{diagrams}->{show};
    } */


    /* my $target = $::config->{settings}->{transcode} || $song->{system};
    if ( $diagrams =~ /^(user|all)$/
	 && !App::Music::ChordPro::Chords::Parser->get_parser($target,1)->has_diagrams ) {
	$diag->{orig} = "(End of Song)";
	do_warn( "Chord diagrams suppressed for " .
		 ucfirst($target) . " chords" ) unless $options->{silent};
	$diagrams = "none";
    }

    if ( $diagrams =~ /^(user|all)$/ ) {
	my %h;
	@used_chords = map { $h{$_}++ ? () : $_ } @used_chords;

	if ( $diagrams eq "user" ) {
	    @used_chords =
	    grep { safe_chord_info($_)->{origin} eq "user" } @used_chords;
	}

	if ( $::config->{diagrams}->{sorted} ) {
	    @used_chords =
	      sort App::Music::ChordPro::Chords::chordcompare @used_chords;
	}
	$song->{chords} =
	  { type   => "diagrams",
	    origin => "song",
	    show   => $diagrams,
	    chords => [ @used_chords ],
	  };
    }


    my $xp = $options->{transpose};
    my $xc = $::config->{settings}->{transcode};
    if ( $xc && App::Music::ChordPro::Chords::Parser->get_parser($xc,1)->movable ) {
	if ( $song->{meta}->{key}
	     && ( my $i = App::Music::ChordPro::Chords::parse_chord($song->{meta}->{key}->[0]) ) ) {
	    $xp = - $i->{root_ord};
	    delete $song->{meta}->{key};
	}
	else {
	   $xp = 0;
	}
    }

    # Global transposition and transcoding.
    $song->transpose( $xp, $xc ); */

    return song
  }

  add (type, text) {
    //my $self = shift;
    song.body.push({'context': inContext, type, text})
    if(inContext == 'chorus') {
      chorus.push({'context': inContext, type, text})
      chorusXpose = xpose
    }
  }

  // line 333
  decompose (line) {
    // $line =~ s/\s+$//;
    line = line.replace(/\s+$/)
    let a = line.split(reChords)

    if (a.lenght <= 1) {
      return {'phrases' : [line]}
    }
    let dummy = 0
    if (a[0] == '') a.shift()
    if (!a[0].match(reChords)) {
      a.unshift([])
      dummy++
    }
    var phrases = [], chords = []
    while (a.length > 0) {      
      let chord = a.shift()
      phrases.push(a.shift())
      var chordRegex = /^\[(.*)\]$/g
      let match = chordRegex.exec(chord)
      if (match[1] && match[1] != '^') {
        chords.push(this.chord(match[1]))
        // TODO
        /* if ( $memchords && !$dummy ) {
          if ( $memcrdinx == 0 ) {
              $memorizing++;
          }
          if ( $memorizing ) {
              push( @$memchords, $chords[-1] );
          }
          $memcrdinx++;
            } */
      }
      // TODO
      /* # Recall memorized chords.
      elsif ( $memchords ) {
          if ( $memcrdinx == 0 && @$memchords == 0 ) {
        do_warn("No chords memorized for $in_context");
        push( @chords, $chord );
        undef $memchords;
          }
          elsif ( $memcrdinx >= @$memchords ) {
        do_warn("Not enough chords memorized for $in_context");
        push( @chords, $chord );
          }
          else {
        push( @chords, $memchords->[$memcrdinx]);
          }
          $memcrdinx++;
      } */
      else {
        chords.push(chord)
      }
      dummy = 0
    }
    return { 'phrases': phrases, 'chords': chords}
  }

  cdecompose (line) {
    return
  }

  // line 295
  chord (chord) {
    if (chord.length < 1) return chord
    if (chord.match(/^\*/)) return chord
    //TODO
    /* my $parens = $c =~ s/^\((.*)\)$/$1/;

    my $info = App::Music::ChordPro::Chords::identify($c);
    unless ( $info->{system} ) {
	if ( $info->{error} && ! $warned_chords{$c}++ ) {
	    do_warn( $info->{error} ) unless $c =~ /^n\.?c\.?$/i;
	}
    }

    # Local transpose, if requested.
    if ( $xpose ) {
	$_ = App::Music::ChordPro::Chords::transpose( $c, $xpose )
	  and
	    $c = $_;
    }

    push( @used_chords, $c );

    return $parens ? "($c)" : $c; */
    return chord

  }

  /**
   * Remove white spaces from a directive.
   * 
   * A line with a directive could contain white spaces. This function removes them all.
   * 
   * @param {string} d the directive to split.
   * @return {Array} an array of two elements. The first one is the directive, the second one is either empty or the argument of a directive which should be split by a colon.
   */
  dirSplit (d) {
    d = d.replace(/^[: ]+/,'')
    d = d.replace(/\s+$/,'')
    var dir = d.toLowerCase()
    var arg = ''
    var result = /^(.*?)[: ]\s*(.*)/.exec(d)
    if (result != null) {
      dir = result[1].toLowerCase()
      arg = result[2].toLowerCase()
    }      
    dir = dir.replace(/[: ]+$/,'')
    return [dir, arg]
  }

  directive(d, options) {
    var [dir, arg] = this.dirSplit(d)
    if (dir == 'soc') dir = 'start_of_chorus'
    else if (dir == 'sot') dir = 'start_of_tab'
    else if (dir == 'eoc') dir = 'end_of_chorus'
    else if (dir == 'eot') dir = 'end_of_tab'

    var result = /^start_of_(\w+)$/.exec(dir)

    if (result != null) {
      if (inContext != '') {
        console.warn('Already in ' + ucfirst(inContext) + ' context\n')
      }
      inContext = result[1]
      if(inContext == 'chorus') {
        var chorus = [], chorusXpose = 0
      }
      var gridRegex = /^ (?: (\d+) \+)? (\d+) (?: x (\d+) )? (?:\+ (\d+) )? ?:\s+ (.*)? )? $/mx
      result = gridRegex.exec(arg)
      if ( inContext == 'grid' && arg == '' && gridArg ) {
        this.add({type: 'set', name: 'gridparams', value: gridArg})
      }
      else if (inContext == 'grid' && arg && result != null) {
        if(result[2]) {
          gridArg = [ result[2], result[3], result[1], result[4] ];
          this.add({type: 'set', name: 'gridparams', value: [ gridArg, result[5] || '' ] })
          gridCells = [ result[2] * ( result[3] || 1 ), (result[1] || 0), (result[4] || 0) ]
        }
        else {
          console.warn(`Invalid grid params: ${arg} (must be non-zero)`)
          return
        }
      }
      else if (arg && arg != '') {
        this.add( {type: 'set', name: 'label', value: 'arg'} )
        labels.push(arg)
      }
      else {
        if (arg) {
          let garbage = $1
          console.warn(`Garbage in start_of_${garbage}: ${arg} (ignored)\n`)
        }
      }
      /* # Enabling this always would allow [^] to recall anyway.
      # Feature?
      if ( $::config->{settings}->{memorize} ) {
          $memchords = $memchords{$1} //= [];
          $memcrdinx = 0;
          $memorizing = 0;
      }
      return 1;
       */
    }
    result = /^end_of_(\w+)$/.exec(dir)
    if (result != null) {
      if (inContext != result[1]) {
        let thisContext = ucfirst(result[1])
        console.warn(`Not in ${thisContext} context\n`)
      }
      this.add( {type: 'set', name: 'context', value: defContext} )
      inContext = defContext
      memChords = undefined
      return 1
    }
    var chorusRegex = /^chorus$/i
    result = chorusRegex.exec(dir)
    if (result != null) {
      if(inContext) {
        console.warn(`{chorus} encountered while in ${inContext} context -- ignored\n`)
        return 1
      }
      //my $chorus =
      //@chorus ? App::Music::ChordPro::Config::clone(\@chorus) : [];
      var thisChorus = chorus
      if(thisChorus && arg && arg != '') {
        if (thisChorus[0].type == 'set' && thisChorus[0].name == 'label') {
          thisChorus[0].value = arg
        }
        else {
          thisChorus.unshift( {type: 'set', name: 'label', value: arg, context: 'chorus'})
        }
        labels.push(arg)
      }
      if ( thisChorus ) {
        this.add( {type: 'rechorus', chorus: thisChorus, transpose: xpose - chorusXpose})
      }
      else {
        this.add( {type: 'rechorus'})
      }
      return 1
    }

/*     # Song settings.

    # Breaks.

    if ( $dir =~ /^(?:colb|column_break)$/i ) {
	$self->add( type => "colb" );
	return 1;
    }

    if ( $dir =~ /^(?:new_page|np|new_physical_page|npp)$/i ) {
	$self->add( type => "newpage" );
	return 1;
    }

    if ( $dir =~ /^(?:new_song|ns)$/i ) {
	die("FATAL - cannot start a new song now\n");
    } */

    var comment
    if(/^(?:comment|c|highlight)$/.exec(dir)) {
      comment = 'comment'
    }
    else if (/^(?:comment_italic|ci)$/.exec(dir)) {
      comment = 'comment_italic'
    }
    else if (/^(?:comment_box|cb)$/.exec(dir)) {
      comment = 'comment_box'
    }
    if (comment) {
      let res = this.cdecompose(arg)
      if (!(res.text && /^[ \t]*$/.exec(res.text))) {
        this.add({type: comment, res, orig: arg})
      }
      return 1
    }
    /* # Images.
    if ( $dir eq "image" ) {
	use Text::ParseWords qw(shellwords);
	my @args = shellwords($arg);
	my $uri;
	my $id;
	my %opts;
	foreach ( @args ) {
	    if ( /^(width|height|border|center)=(\d+)$/i ) {
		$opts{lc($1)} = $2;
	    }
	    elsif ( /^(scale)=(\d(?:\.\d+)?)$/i ) {
		$opts{lc($1)} = $2;
	    }
	    elsif ( /^(center|border)$/i ) {
		$opts{lc($_)} = 1;
	    }
	    elsif ( /^(src|uri)=(.+)$/i ) {
		$uri = $2;
	    }
	    elsif ( /^(id)=(.+)$/i ) {
		$id = $2;
	    }
	    elsif ( /^(title)=(.*)$/i ) {
		$opts{title} = $2;
	    }
	    elsif ( /^(.+)=(.*)$/i ) {
		do_warn( "Unknown image attribute: $1\n" );
		next;
	    }
	    else {
		$uri = $_;
	    }
	}
	$uri = "id=$id" if $id;
	unless ( $uri ) {
	    do_warn( "Missing image source\n" );
	    return;
	}
	$self->add( type => "image",
		    uri  => $uri,
		    opts => \%opts );
  return 1; 
}*/
    if (/^(?:title|t)$/.exec(dir)) {
      song.title = arg
      song.meta.title.push(arg)
      return 1
    }
    if (/^(?:subtitle|st)$/.exec(dir)) {
      song.subtitle.push(arg)
      song.meta.subtitle.push(arg)
      return 1
    }
    /* # Metadata extensions (legacy). Should use meta instead.
    # Only accept the list from config.
    if ( $re_meta && $dir =~ $re_meta ) {
	$arg = "$1 $arg";
	$dir = "meta";
    } */
    /* # More metadata.
    if ( $dir =~ /^(meta)$/ ) {
	if ( $arg =~ /([^ :]+)[ :]+(.*)/ ) {
	    my $key = lc $1;
	    my $val = $2;
	    if ( $key eq "key" ) {
		$val =~ s/[\[\]]//g;
		my $xp = $xpose;
		$xp += $options->{transpose} if $options->{transpose};
		$val = App::Music::ChordPro::Chords::transpose( $val, $xp )
		  if $xp;
	    }
	    elsif ( $key eq "capo" ) {
		do_warn("Multiple capo settings may yield surprising results.")
		  if $song->{meta}->{capo};
		if ( $options->{decapo} ) {
		    $xpose += $val;
		    my $xp = $xpose;
		    $xp += $options->{transpose} if $options->{transpose};
		    for ( qw( key key_actual key_from ) ) {
			next unless exists $song->{meta}->{$_};
			$song->{meta}->{$_}->[-1] =
			  App::Music::ChordPro::Chords::transpose( $song->{meta}->{$_}->[-1], $xp )
		    }
		    return 1;
		}
	    }
	    elsif ( $key eq "duration" && $val ) {
		$val = duration($val);
	    }

	    if ( $::config->{metadata}->{strict}
		 && ! ( $re_meta && $key =~ $re_meta ) ) {
		# Unknown, and strict.
		do_warn("Unknown metadata item: $key");
		return;
	    }

	    push( @{ $song->{meta}->{$key} }, $val );
	}
	else {
	    do_warn("Incomplete meta directive: $d\n");
	    return;
	}
	return 1;
    } */
    //return 1 if $self->global_directive( $d, $options, 0 );

    if(!/^x_/.exec(d)) {
      console.warn(`Unknown directive: $d\n`)
    }
    return
  }


}