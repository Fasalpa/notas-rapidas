function timeRemaining(timeStamp) {
  const difference = timeStamp - Date.now();
  let days = 0;

  const response = difference
    ? "🌋 Nota destruída"
    : (days = Math.floor(difference / (1000 * 60 * 60 * 24)));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return `${hours}:${minutes}:${seconds}`;
}


console.log(timeRemaining(nota.destruction));