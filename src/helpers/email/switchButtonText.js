const switchButtonText = (type) => {
  switch (type) {
    case 'New Request':
      return 'View Request';
    case 'Trip Survey':
      return 'Fill Survey';
    default:
      return '';
  }
};

export default switchButtonText;
