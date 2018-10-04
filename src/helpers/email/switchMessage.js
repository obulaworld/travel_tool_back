const switchMessage = (msgDetail) => {
  switch (msgDetail.type) {
    case 'New Request':
      return (
        `<b style="text-transform: capitalize">${msgDetail.senderName}</b>
        just submitted a travel request for your approval. Login to your
        travela account for details.
        `
      );
    default:
      return '';
  }
};

export default switchMessage;
