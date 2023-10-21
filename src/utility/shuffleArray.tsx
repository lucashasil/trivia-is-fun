// basic implementation of Durstenfeld Shuffle (an optimised Fisher-Yates Shuffle)
// https://gist.github.com/webbower/8d19b714ded3ec53d1d7ed32b79fdbac
export function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
