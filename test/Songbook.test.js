import { Songbook } from '../chordpro/Songbook'

test('decompose line', () => {
  var songbook = new Songbook()
  var result = songbook.decompose('[Am]Who is like [F]Him,')
  expect(result.chords.length).toBe(2)
  expect(result.phrases.length).toBe(2)
  expect(result).toEqual({ 'phrases': ['Who is like ', 'Him,'], 'chords': ['Am', 'F']})
})