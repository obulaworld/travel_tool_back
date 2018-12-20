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
    case 'Guesthouse Check-out':
      return 'View Check Out Details';
    case 'Guesthouse Check-In':
      return 'View Check In Details';
    default:
      return 'View Request';
  }
};

export default switchButtonText;
