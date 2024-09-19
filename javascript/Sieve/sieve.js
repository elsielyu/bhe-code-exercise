class Sieve {
  /**
   * Original Eratosthenes algorithm, good to use for smallish n (n <= 1000000)
   * @param {number} n - an integer that represents the nth prime to be returned, 0-indexed
   * @returns {Array[number]} - an array of primes up to the nth prime
   */
  sieveOfEratosthenes(n) {
    // assume upper bound can be computed as n*(ln(n) + ln(ln(n)) + 3)
    // for n >= 3
    // this is an approximation TO the nth prime (not just an upper bound of the nth prime)
    // references: https://math.stackexchange.com/questions/3338704/what-is-the-rough-upper-bound-to-find-nth-prime-also-give-the-maximum-error
    // https://stackoverflow.com/questions/9625663/calculating-and-printing-the-nth-prime-number

    // since upper bound is true only for n >= 3, hardcode the first 3 primes
    if (n === 0) return [2];
    if (n === 1) return [2, 3];
    if (n === 2) return [2, 3, 5];

    const upperBound = Math.ceil(n * (Math.log(n) + Math.log(Math.log(n))) + 3);

    // initial array of trues; the first two entries will stay true even though they refer to
    // non-primes because the for loop below begins at 2 rather than 0
    const integers = new Array(upperBound + 1).fill(true);

    // algorithm for marking composites as false
    for (let i = 2; i < integers.length; i++) {
      if (integers[i]) {
        for (let j = i*i; j < integers.length; j += i) {
          integers[j] = false;
        }
      }
    }

    const primes = [];
    // gather all the primes together in one array
    for (let k = 2; k < integers.length; k++) {
      if (integers[k]) {
        primes.push(k);
      }
    }

    return primes;
  }

  /**
   * Variant Eratosthenes algorithm, good to use for largish n (n > 1000000)
   * @param {number} n - an integer that represents the nth prime to be returned, 0-indexed
   * @returns {Array[number]} - an array of primes up to the nth prime
   */
  segmentedSieve(n) {
    if (n === 0) return [2];
    if (n === 1) return [2, 3];
    if (n === 2) return [2, 3, 5];
    const upperBound = Math.ceil(n * (Math.log(n) + Math.log(Math.log(n))) + 3);
    const segmentSize = Math.floor(Math.sqrt(upperBound)) + 1;
    // find primes of first segment the regular way
    const primes = this.sieveOfEratosthenes(segmentSize);

    // break range into segments
    let bottom = segmentSize;
    let top = segmentSize * 2;
    // iterate through subsequent segments and mark as composite those that are multiples of 
    // elements in primes
    while (bottom < upperBound) {
      if (top >= upperBound) {
        top = upperBound;
      }
      const integers = new Array(segmentSize + 1).fill(true);
      // iterate through primes to find those in current segment
      for (let i = 0; i < primes.length; i++) {
        // lowest number in this segment that is a multiple of primes[i]
        let lowest = Math.floor(bottom/primes[i]) * primes[i];
        if (lowest < bottom) {
          lowest += primes[i];
        }
        // marking elements in current segment that are a multiple of primes[i], offset by bottom
        // i.e. [50, 100] is like marking [0, 50]
        // space-saving
        for (let j = lowest; j < top; j += primes[i]) {
          integers[j - bottom] = false;
        }
      }
      for (let k = bottom; k < top; k++) {
        if (integers[k - bottom]) {
          primes.push(k);
        }
      }
      bottom += segmentSize;
      top += segmentSize;
    }
    return primes;
  }

  /**
   * This algorithm is a tweaked version (to account for 0-indexing) of the one that comes from
   * https://stackoverflow.com/questions/9625663/calculating-and-printing-the-nth-prime-number
   * @param {number} n - an integer that represents the nth prime to be returned, 0-indexed
   * @returns {number} - the nth prime
   */
  optimizedSieve(n) {
    if (n === 0) return 2;
    if (n === 1) return 3;
    if (n === 2) return 5;
    let limit = 1;
    let root = 1;
    let count = 1;

    limit = Math.floor(n * (Math.log(n) + Math.log(Math.log(n))) + 3);
    root = Math.floor(Math.sqrt(limit)) + 1;
    limit = Math.floor((limit-1)/2);
    root = root/2 - 1;
    const sieve = new Array(limit).fill(false);
    let p;
    for (let i = 0; i < root; i++) {
      if (!sieve[i]) {
        count++;
        for (let j = 2*i*(i+3)+3, p = 2*i+3; j < limit; j += p) {
          sieve[j] = true;
        }
      }
    }
    for (p = Math.ceil(root); count < n+1; p++) {
      if (!sieve[p]) {
          count++;
      }
    }
    return 2*p+1;
  }

   /**
   * This algorithm is a tweaked version (to account for 0-indexing) of the
   * even-faster-one-whose-code-is-like-mathematical-black-magic that comes from
   * https://stackoverflow.com/questions/9625663/calculating-and-printing-the-nth-prime-number
   * @param {number} n - an integer that represents the nth prime to be returned, 0-indexed
   * @returns {number} - the nth prime
   */
   optimizedSieve2(n) {
    const popCount = (num) => {
      num -= (num >>> 1) & 0x55555555;
      num = ((num >>> 2) & 0x33333333) + (num & 0x33333333);
      num = ((num >> 4) & 0x0F0F0F0F) + (num & 0x0F0F0F0F);
      return (num * 0x01010101) >> 24;
    }

    if (n === 0) return 2;
    if (n === 1) return 3;
    if (n === 2) return 5;
    let limit = 2;
    let root = 2;
    let count = 2;

    limit = Math.floor(n * (Math.log(n) + Math.log(Math.log(n))) + 3);
    root = Math.floor(Math.sqrt(limit));
    switch(limit%6) {
      case 0:
          limit = 2*(limit/6) - 1;
          break;
      case 5:
          limit = 2*(limit/6) + 1;
          break;
      default:
          limit = 2*(limit/6);
    }
    switch(root%6) {
      case 0:
          root = 2*(root/6) - 1;
          break;
      case 5:
          root = 2*(root/6) + 1;
          break;
      default:
          root = 2*(root/6);
    }
    const dim = (limit+31) >> 5;
    const sieve = new Array(dim);
    for (let i = 0; i < root; i++) {
      if ((sieve[i >> 5] & (1 << (i&31))) === 0) {
        let start, s1, s2;
        if ((i & 1) === 1) {
          start = i*(3*i+8)+4;
          s1 = 4*i+5;
          s2 = 2*i+3;
        } else {
          start = i*(3*i+10)+7;
          s1 = 2*i+3;
          s2 = 4*i+7;
        }
        for(let j = start; j < limit; j += s2) {
          sieve[j >> 5] |= 1 << (j&31);
          j += s1;
          if (j >= limit) break;
          sieve[j >> 5] |= 1 << (j&31);
        }
      }
    }
    let k;
    for(k = 0; count < n+1; k++) {
      count += popCount(~sieve[k]);
    }
    k--;
    const mask = ~sieve[k];
    let p;
    for (p = 31; count >= n+1; p--) {
      count -= (mask >> p) & 1;
    }
    return 3*(p+(k<<5))+7+(p&1);
  }

  /**
   * Function to return the nth prime of primes going in ascending order, 0-indexed
   * @param {number} n - an integer that represents the nth prime to be returned, 0-indexed
   * @returns {number} - the nth prime
   */
  NthPrime(n) {
    return this.optimizedSieve2(n);
    //return this.optimizedSieve(n); //<-- passes all but the 100mil test
    //return this.segmentedSieve(n)[n]; <-- passes 10mil test only when test is run alone
    //return this.sieveOfEratosthenes(n)[n]; <-- good for 1mil test, but out of mem at 10mil
  }
}
/*
const sieve = new Sieve();
const prime0 = sieve.NthPrime(0);
const prime1 = sieve.NthPrime(1);
const prime3 = sieve.NthPrime(3);
const prime8 = sieve.NthPrime(8);
const prime10 = sieve.NthPrime(10);
const prime99 = sieve.NthPrime(99);
const prime500 = sieve.NthPrime(500);
const prime1000 = sieve.NthPrime(1000);
const prime10000 = sieve.NthPrime(10000);
const prime100000 = sieve.NthPrime(100000);
const prime1mil = sieve.NthPrime(1000000);
const prime10mil = sieve.NthPrime(10000000);
const prime100mil = sieve.NthPrime(100000000);
console.log(prime0, prime1, prime3, prime8, prime10, prime99, prime500, prime1000, prime10000, prime100000, prime1mil, prime10mil, prime100mil);
*/
module.exports = Sieve;
