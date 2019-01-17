class TravelReadinessUtils {
  static getMailData(details, user, topic, type, travelAdmin) {
    const mailBody = {
      recipient: { name: user.fullName, email: user.email, details },
      sender: travelAdmin.UserInfo.name,
      topic,
      type,
      details,
      requestId: details.id,
      redirectLink:
        `${process.env.REDIRECT_URL}/travel_readiness?id=${details.id}&type=${details.type}`
    };
    return mailBody;
  }
}

export default TravelReadinessUtils;
