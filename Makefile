ssh:
	@docker-compose -f docker/dev/docker-compose.yml exec  app bash

start:
	@docker volume create travel_data
	@docker-compose -f docker/dev/docker-compose.yml up

stop:
	@docker-compose -f docker/dev/docker-compose.yml down

clean:
	@docker-compose -f docker/dev/docker-compose.yml down
	@docker volume prune

migrate:
	@docker-compose -f docker/dev/docker-compose.yml exec app yarn db:migrate

rollback:
		@docker-compose -f docker/dev/docker-compose.yml exec app yarn db:rollback
