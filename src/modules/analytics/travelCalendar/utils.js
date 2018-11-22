import _ from 'lodash';

class Utils {
  static generateFlight(destination, airline, ticketNumber, arrivalTime, departureTime) {
    const details = {
      destination,
      airline,
      flightNo: ticketNumber,
      arrivalTime,
      departureTime
    };
    return details;
  }

  static checkTicketDetails(ticket) {
    const noValue = '--';
    const ticketValues = _.mapValues(ticket, details => (!details ? noValue : details));
    return ticketValues;
  }

  static getConsolidateItenerary(arrivalData, departureData) {
    const arrival = Utils.generateFlight(...arrivalData);
    const departure = Utils.generateFlight(...departureData);
    return {
      arrival: { ...arrival },
      departure: { ...departure }
    };
  }

  static handleDestinations(location, tripType, origin, destination, ticket) {
    const {
      departureTime, arrivalTime, airline, ticketNumber, returnDepartureTime, returnTime, returnTicketNumber, returnAirline
    } = Utils.checkTicketDetails(ticket);
    const noValue = '--';
    const noValueArray = [noValue, noValue, noValue, noValue, noValue];
    const filteredOrigin = tripType === 'return' ? origin : noValue;
    if (origin === location) {
      const departureData = [destination, airline, ticketNumber, arrivalTime, departureTime];
      const flightDetails = Utils.getConsolidateItenerary(noValueArray, departureData);
      return flightDetails;
    }
    if (destination === location) {
      if (tripType === 'oneWay') {
        const onewayArrival = [destination, airline, ticketNumber, arrivalTime, departureTime];
        const flightData = Utils.getConsolidateItenerary(onewayArrival, noValueArray);
        return flightData;
      }
      const arrival = [destination, airline, ticketNumber, arrivalTime, departureTime];
      const departure = [filteredOrigin, returnAirline, returnTicketNumber, returnTime, returnDepartureTime];
      const flight = Utils.getConsolidateItenerary(arrival, departure);
      return flight;
    }
  }

  static handleMultiTrips(location, multiTrips) {
    const uniqTrips = _.uniqBy(multiTrips, 'id');
    const data = uniqTrips.map((trip) => {
      const {
        name, department, role, picture
      } = trip;
      const userDetails = {
        name, department, role, picture
      };
      const filteredMultiTrips = multiTrips.filter(t => (t.id === trip.id));
      if (filteredMultiTrips.length > 1) {
        const arrivalTrip = _.filter(filteredMultiTrips, { 'trips.destination': location });
        const arrivalData = Utils.getItenerary(location, arrivalTrip[0]);
        const departureTrip = _.filter(filteredMultiTrips, { 'trips.origin': location });
        const departureData = Utils.getItenerary(location, departureTrip[0]);
        const flight = { arrival: arrivalData.arrival, departure: departureData.departure };
        return { ...userDetails, flight };
      }
      const ticket = JSON.parse(trip['trips.submissions.value']);
      const flight = Utils.handleDestinations(location, 'multi', trip['trips.origin'], trip['trips.destination'], ticket);
      return { ...userDetails, flight };
    });
    return data;
  }

  static getItenerary(location, trip) {
    const ticket = JSON.parse(trip['trips.submissions.value']);
    const data = Utils.handleDestinations(location, 'multi', trip['trips.origin'], trip['trips.destination'], ticket);
    return data;
  }
}

export default Utils;
