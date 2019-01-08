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
    const returnData = [destination, returnAirline, returnTicketNumber, returnTime, returnDepartureTime];
    const filteredOrigin = tripType === 'return' ? origin : noValue;
    if (origin === location) {
      const departureData = [origin, airline, ticketNumber, arrivalTime, departureTime];
      const flightDetails = Utils.getConsolidateItenerary(returnData, departureData);
      return flightDetails;
    }
    if (destination === location) {
      if (tripType === 'oneWay') {
        const noValueArray = [noValue, noValue, noValue, noValue, noValue];
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

  static handleMultiTrips(location, multiTrip) {
    const uniqTrips = _.uniqBy(multiTrip, 'id');

    const data = _.flattenDeep(uniqTrips.map((trip) => {
      const {
        name, department, role, picture
      } = trip;
      const userDetails = {
        name, department, role, picture
      };

      const filteredMultiTrip = _.orderBy(multiTrip.filter(t => (t.id === trip.id)), ['trips.departureDate'], ['asc']);

      if (filteredMultiTrip.length > 1) {
        const arrivalTrip = _.orderBy(_.filter(filteredMultiTrip, { 'trips.destination': location }), ['trips.departureDate'], ['asc']);
        const departureTrip = _.orderBy(_.filter(filteredMultiTrip, { 'trips.origin': location }), ['trips.departureDate'], ['asc']);

        const trips = [];
        _.forEach(arrivalTrip, (arrival, index) => {
          const arrivalData = Utils.getItenerary(location, arrival);
          const departureData = Utils.getItenerary(location, departureTrip[index]);
          const flight = { arrival: arrivalData.arrival, departure: departureData.departure };

          trips.push({ ...userDetails, flight });
        });
        return trips;
      }
      const ticket = JSON.parse(trip['trips.submissions.value']);
      const flight = Utils.handleDestinations(location, 'multi', trip['trips.origin'], trip['trips.destination'], ticket);
      return { ...userDetails, flight };
    }));

    return data;
  }

  static getItenerary(location, trip) {
    const ticket = JSON.parse(trip['trips.submissions.value']);
    const data = Utils.handleDestinations(location, 'multi', trip['trips.origin'], trip['trips.destination'], ticket);
    return data;
  }

  static handlePagination(allData, limit, page) {
    const offset = (page - 1) * limit;
    const results = allData.slice(offset, (page * limit));
    return results;
  }
}

export default Utils;
