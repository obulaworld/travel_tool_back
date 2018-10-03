class BedName {
  static numberRange(start, end) {
    return Array(end - start + 1).fill().map((item, index) => start + index);
  }

  static getAvailableBedNames(max, bedNamesTaken) {
    // Get available bed names
    const maxBedNumber = this.numberRange(1, max);
    const bedNameValues = bedNamesTaken.map(bed => bed.bedName);
    const availableBedNames = [];
    maxBedNumber.map((num) => {
      if (!bedNameValues.includes(`bed ${num}`)) {
        availableBedNames.push(`bed ${num}`);
      }
      return num;
    });

    return availableBedNames;
  }
}

export default BedName;
