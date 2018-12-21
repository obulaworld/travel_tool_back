const switchButtonText = (type) => {
  switch (type) {
    case 'New Request':
      return 'View Request';
    case 'Trip Survey':
      return 'Start Survey';
    case 'Deleted Request':
      return 'View Notification';
    case 'Travel Readiness':
      return 'View Dashboard';
    default:
      return 'View Request';
  }
};

export default switchButtonText;
