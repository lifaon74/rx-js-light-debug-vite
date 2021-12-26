export function arrayEquals<GValue>(
  arrayA: ArrayLike<GValue>,
  arrayB: ArrayLike<GValue>,
): boolean {
  const lengthA: number = arrayA.length;
  if (lengthA === arrayB.length) {
    for (let i = 0; i < lengthA; i++) {
      if (arrayA[i] !== arrayB[i]) {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
}
