import { Song } from './Song'

// Parser context
var inContext = defContext = ''
var gridArg, gridCells

// Locel transposition
var xpose = 0

var usedChords = []

var chorus = [], chorusXpose = 0

var reChords

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
    /* while (lines.length > 0) {
      diag.line = ++linecnt
      diag.orig = lines.shift();
      let current = diag.orig;
      if ( /^\s*\{(new_song|ns)\}\s*$/ ) {
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
        /* $self->add( type => "ignore",
        text => $_ )
          unless
        $options->{_legacy}
          ? $self->global_directive( $1, $options, 1 )
          : $self->directive( $1, $options );
        next; */
    }

    if (inContext == 'tab') {
/*         $self->add( type => "tabline", text => $_ );
        next; */
    }

    if (inContext == 'grid') {
/*         $self->add( type => "gridline", $self->decompose_grid($_) );
        next; */
    }
  }


  add (type, text) {
    //my $self = shift;
    song.body.push({'context': inContext, text})
    if(inContext == 'chorus') {
      chorus.push({'context': inContext, text})
      chorusXpose = xpose
    }
  }

  // line 333
  decompose (line) {
    // $line =~ s/\s+$//;
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
}