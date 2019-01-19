import checkoutTemplate from './checkoutTemplate';

const attachCommentToMail = msgDetail => (
  `
  <b>${msgDetail.senderName}</b> posted a comment.
        Login to your travela account for details.
  <table
          style ="width: 80%;
                  background-color: #F8F8F8;
                  margin: auto;
                  margin-bottom: 10px;
                  text-align: left;
                  ">
          <tbody >
            <tr >
            <td width="20%" ><img src=${msgDetail.picture}
            style="border-radius: 50%; width: 50px; height: 50px;"
            /></td>
            <td width="80%">
              <i>${msgDetail.comment.dataValues.comment}</i></td>
            </tr>
            </tbody>
            </table>
  `
);

const deleteMessage = msgDetail => `The travel request\
<b> #${msgDetail.requestId}</b> was just deleted
  by ${msgDetail.senderName}. Login to your travela account for details.`;

const updateMessage = msgDetail => (
  `<b style="text-transform: capitalize;\
  ">${msgDetail.senderName}</b> just updated a travel request for your approval. Login to your
  travela account for details.`);

const checKoutMessage = msgDetail => (
  `<b style="text-transform: capitalize">${msgDetail.senderName}</b> has checked out at ${msgDetail.guesthouseName} guesthouse at ${msgDetail.checkoutTime}`
);

const switchMessage = (msgDetail) => {
  switch (msgDetail.type) {
    case 'New Request':
      return (
        `<b style="text-transform: capitalize">${msgDetail.senderName}</b> just submitted a travel request for your approval. Login to your
        travela account for details.`);
    case 'Approved':
      return (
        `Your travel request <b>#${msgDetail.requestId}</b> was just approved
        by ${msgDetail.senderName}. Login to your travela account for details.`);
    case 'Rejected':
      return (`Your travel request <b>#${msgDetail.requestId}</b> was rejected by
        ${msgDetail.senderName}. Login to your travela account for details.`);
    case 'Verified':
      return (`Your travel request <b>#${msgDetail.requestId}</b> was just verified by
          ${msgDetail.senderName}. Login to your travela account for details.`);
    case 'Request': return (attachCommentToMail(msgDetail));
    case 'Document': return (attachCommentToMail(msgDetail));
    case 'Deleted Request': return deleteMessage(msgDetail);
    case 'Updated Request': return updateMessage(msgDetail);
    case 'Changed Room':
      return (
        `Your residence record for the travel request
        <a href="${process.env.REDIRECT_URL}/requests/${msgDetail.requestId}"><b>#
        ${msgDetail.requestId}</b></a> was updated by ${msgDetail.senderName}. <b>
        Login to your travela account for details.`);
    case 'Trip Survey':
      return checkoutTemplate(msgDetail.destination);
    case 'Travel Readiness':
      return (`${msgDetail.senderName[1]} has achieved 100% travel readiness for trip to ${msgDetail.senderName[2]}. Kindly login to your Travela account for details.`);
    case 'Guesthouse Check-In':
      return (
        `<b style="text-transform: capitalize">${msgDetail.senderName}</b> has checked in at ${msgDetail.guesthouseName} guesthouse at ${msgDetail.checkInTime} and would be spending ${msgDetail.durationOfStay} day(s). Click on the link below to view details`
      );
    case 'Guesthouse Check-out': return checKoutMessage(msgDetail);
    case 'Travel Readiness Document Verified':
      return (`Your ${msgDetail.details.type} ${msgDetail.details.type === 'passport' ? 'with number' : 'to'}
          <b>${msgDetail.details.type === 'passport' ? msgDetail.details.data.passportNumber : msgDetail.details.data.country}</b>
          has been verified by ${msgDetail.senderName} on ${msgDetail.details.createdAt}. Login to your travela account for details.`);
    case 'Edit Travel Document':
      return (`${msgDetail.details.user.name} just edited a travel document on Travela`);
    default: return '';
  }
};
export default switchMessage;
