import { Songbook } from '../chordpro/Songbook'

test('decompose line', () => {
  var songbook = new Songbook()
  var result = songbook.decompose('[Am]Who is like [F]Him,')
  expect(result.chords.length).toBe(2)
  expect(result.phrases.length).toBe(2)
  expect(result).toEqual({ 'phrases': ['Who is like ', 'Him,'], 'chords': ['Am', 'F']})
})

test('split directive chorus', () => {
  var songbook = new Songbook()
  var [dir, arg] = songbook.dirSplit('       chorus')
  expect(dir).toEqual('chorus')
  expect(arg).toEqual('')
})

test('split directive comment', () => {
  var songbook = new Songbook()
  var [dir, arg] = songbook.dirSplit('c:Test ')
  expect(dir).toEqual('c')
  expect(arg).toEqual('test')
})

test('directive start_of_chorus', () => {
  var songbook = new Songbook()
  var [dir, arg] = songbook.directive('  start_of_chorus ')
  expect(dir).toEqual('c')
  expect(arg).toEqual('test')
})