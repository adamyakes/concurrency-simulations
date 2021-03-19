# Concurrency Simulations

### An interactive tool for visualization of classic concurrency problems

This is the repository for the MSE capstone project for Adam Yakes. I welcome anybody to use this tool and any pull requests for improvements. It's available under an [MIT License](LICENSE).

The goal of this project was to create an educational tool for use in a Computer Science course teaching concurrency. It uses problems and solutions from [The hLittle Book of Semaphores](https://greenteapress.com/wp/semaphores/) by Allen B. Downey, and creates visualizations of those problems. Users can parameterize the runs of the simulation to change its behavior and see how different inputs can affect throughput and fairness. After a run is completed, summary information is saved which gives numerical data about the qualities shown.

The project is built with [Angular](https://angular.io/) and has a backend written in [Go](https://go.dev/), uses [gRPC](https://grpc.io/) to communicate in live time, has animations written in [SVG.js](https://svgjs.com/docs/3.0/), and saves past run information in a [PostgreSQL](https://www.postgresql.org/) database.

## Getting set up

It's still an open [issue](https://github.com/adamyakes/concurrency-simulations/issues/1) to add instructions to get everything deployed with Docker alone, but for now, here's how to set up a dev environment:

- Install the [Angular CLI](https://angular.io/cli/) with NPM:
  ```
	npm install -g @angular/cli
	```

- Get the Angular application set up. Angular generates static files that can be served with any server but this command runs a development server at `localhost:4200`. The build takes less time in subsequent builds.
  ```
	cd angular
	npm install
	ng serve
	```

- Build and run the Envoy Docker container. This is just a proxy for the gRPC server. You only need to build once.
  ```
  # If Windows / Mac host
	cd go
	docker build -t css/envoy .
	docker run -p 8080:8080 -d css/envoy
	```
	```
	# If Linux host
	cd go
	docker build -f Dockerfile-linux -t css/envoy .
	docker run -p 8080:8080 -d css/envoy
	```

- Set up the Postgres database. This application targeted PostgreSQL 12/13 and was not tested on earlier versions. This script generates the necessary tables and functions, and sets the owner to the default user `postgres`.
  ```
	cd go
	psql -U postgres -f css.sql
	```

- Run the Go server (install Go if you haven't already). This command will automatically download its dependencies, build the server and run it. It displays "Serving" when it's ready.
  ```
	cd go
	go run cmd/grpc/main.go -c "dbname=css user=postgres password={enter the password for postgres} host=localhost sslmode=disable"
	```

- Visit `localhost:4200` and you should be good to to!



