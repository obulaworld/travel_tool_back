

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
            <td width="20%" ><img src=${msgDetail.comment.dataValues.picture} 
            style="
            border-radius: 50%;
            width: 50px;
            height: 50px;
              "
            /></td>
            <td width="80%"> 
              <i>${msgDetail.comment.dataValues.comment}</i></td>
            </tr>
            </tbody>
            </table>
  `
);


const switchMessage = (msgDetail) => {
  switch (msgDetail.type) {
    case 'New Request':
      return (
        `<b style="text-transform: capitalize">${msgDetail.senderName}</b>
        just submitted a travel request for your approval. Login to your
        travela account for details.`);
    case 'Approved':
      return (
        `Your travel request <b>#${msgDetail.requestId}</b> was just approved
        by ${msgDetail.senderName}. Login to your travela account for details.`);
    case 'Rejected':
      return (`Your travel request <b>#${msgDetail.requestId}</b> was rejected by
        ${msgDetail.senderName}. Login to your travela account for details.`);
    case 'Comments':
      return (
          attachCommentToMail(msgDetail)
        );
    case 'Updated Request':
      return (
        `<b style="text-transform: capitalize;">${msgDetail.senderName}</b>
        just updated a travel request for your approval. Login to your
        travela account for details.`);
    case 'Changed Room':
      return (
        `Your residence record for the travel request 
        <a href="${process.env.REDIRECT_URL}/requests/${msgDetail.requestId}"><b>#
        ${msgDetail.requestId}</b></a> was updated by ${msgDetail.senderName}. 
        Login to your travela account for details.`);
    case 'Trip Survey':
      return (
        `You just checked out of a Travela guesthouse. Please fill in this
        survey to tell us about your guest experience.`);
    default:
      return '';
  }
};
export default switchMessage;
