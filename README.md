# INVENTORY SERVICES
This project consists of microservices intended to be used for an inventory management system. It started out as a prototype for a project at my job, and ended up as a hobby project.
Each microservice is intended to be containerized (using Docker), and Kubernetes is used in managing the deployment, scaling, and overall management of these containers.

## Getting Started
To start the project locally, you would need **Docker** and **Kubernetes** (including kubectl) installed.
Alternatively, you can start the project with just **kubectl** intsalled if you already have a kubernetes cluster.

From the root directory, run the following command:
```bash
kubectl apply -f ./k8s
```

This should create the pods in your Kubernetes cluster.


## Learn more
To learn more about how to use these services, take a look at the swagger documentation:
[https://dr-drake.github.io/api-portal](https://dr-drake.github.io/api-portal)


## License

MIT

**Free Software, Hell Yeah!**