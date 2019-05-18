var reChords 
export class Songbook {

  constructor () {
    this.songs = []
    reChords = /(\[.*?\])/
  }

  parseSong() {
/*     if ( $::config->{settings}->{memorize} ) {
      $re_chords = qr/(\[.*?\]|\^)/;
        }
        else {
      $re_chords = qr/(\[.*?\])/;
        } */
    reChords = /(\[.*?\])/
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