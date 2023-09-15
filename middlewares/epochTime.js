function epochtime() {
    const currentMilliseconds = new Date().getTime();
    const epochSeconds = Math.floor(currentMilliseconds / 1000);
    return epochSeconds;
  }

  function submitDateepoch(){
    const currentMilliseconds = new Date().getTime();
    const currentEpochSeconds = Math.floor(currentMilliseconds / 1000);

    // Calculate the epoch time for 7 days ahead
    const sevenDaysInSeconds = 7 * 24 * 60 * 60;
    const epochTime7DaysAhead = currentEpochSeconds + sevenDaysInSeconds;

    return epochTime7DaysAhead;
  }
  module.exports = {
    epochtime,submitDateepoch
  };