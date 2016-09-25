const log = require("../helpers/common").log;
const router = require("../services/router");

module.exports = {
	route: (sender, rcpt, message) => {
		const route = router.handle(sender, rcpt, message);
		if (route === null) {
			log.info("null route hit");
			return false;
		}
		// TODO: get this player from the database
		log.info(`non-null route hit: [${route.name}]`);
	}
};
