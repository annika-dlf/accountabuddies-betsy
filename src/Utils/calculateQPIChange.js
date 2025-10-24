export const calculateQPIChange = (totalSeconds, remainingSeconds) => {
  const totalMinutes = totalSeconds / 60;
  const remainingMinutes = remainingSeconds / 60;
  const completedMinutes = totalMinutes - remainingMinutes;

  // +0.1 for every 10 minutes done, -0.1 for every 10 minutes missed
  const gain = completedMinutes * 0.01;
  const loss = remainingMinutes * 0.01;
  const netChange = gain - loss;

  // Always round DOWN to two decimal places
  const roundedDown = Math.floor(netChange * 100) / 100;

  return roundedDown;
};
