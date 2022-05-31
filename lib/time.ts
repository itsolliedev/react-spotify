//milliseconds to minutes and seconds
export function msToMinSec(ms: number) {
  var minutes = Math.floor(ms / 60000)
  var seconds = Math.floor((ms % 60000) / 1000)
  return seconds == 60
    ? minutes + 1 + ':00'
    : minutes + ':' + (seconds < 10 ? '0' : '') + seconds
}
