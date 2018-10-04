const switchMessage = (msgDetail) => {
  switch (msgDetail.type) {
    case 'New Request':
      return (
        `<b style="text-transform: capitalize">${msgDetail.senderName}</b>
        just submitted a travel request for your approval. Login to your
        travela account for details.
        `
      );
    case 'Approved':
      return (
        `Your travel request <b>#${msgDetail.requestId}</b> was just approved
        by ${msgDetail.senderName}. Login to your travela account for details.
        `
      );
    case 'Rejected':
      return (
        `Your travel request <b>#${msgDetail.requestId}</b> was rejected by
        ${msgDetail.senderName}. Login to your travela account for details.
        `);
    case 'Comments':
      return (
        `
      <b>${msgDetail.senderName}</b> posted a comment.
      Login to your travela account for details.
      `
      );
    default:
      return '';
  }
};

export default switchMessage;
