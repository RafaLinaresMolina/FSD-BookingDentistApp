# Dental Appointment API REST

This is a project to introduce the use of nodejs, express, mongooose and mongodb.

### Where to test the demo
-> https://appointment-dentist.herokuapp.com/

### A bit of background
This is an example of a backend for an appointment app for a dental clinic.

We have 3 roles for user: Client, Dentist, Admin.
The Client can see the previos appointments and create new ones in 'pending' state
The Dentist can see previos appointments from a certain Client, see own history of appointment. Also and create new appointments and change the status of them.
The Admin can do All the previous stuff and elevate o revoke roles of the users. also can logout any user on the app.

### Data Structure

Users collection: contains all the users in one collection, the backen know by roleId which type of user id [Client, Dentist, Admin].
Appointments collections: contains all the info for the appointments between Client and Dentist.

### Software needed
- nodejs lts (at the time, version 12.19.0)
- mongodb service running
- mongoose for manage the acces to DB and define models.

### Get the repo
- git clone https://github.com/RafaLinaresMolina/FSD-BookingDentistApp.git

### Install dependencies
- ```npm i```

### Add the configuration 

- Add the .env file with the next variables:
  - MONGO_USER: User for acces the cluster
  - MONGO_PASS: Password fo the previous user
  - MONGO_CLUSTER: The cluster name
  - MONGO_DB: The DAtaBase name
  - PORT: The port for express
  - MINIMUM_LEVEL_LOG: Log has 5 levels: Error, Warning, Debug, Info, Data. Setting this limits the levels showed.
    - ![Log example](./log.png)
    - Error: display the message in red, level 0: used for display message from crashes.
    - Warning: display the message in orange, level 1: used for minor mistakes (like search an user by a wrong id and return empty resource)
    - Debug: display the message in blue, level 2: used for keep the executing flow.
    - Info: display the message in light blue, level 3: Used for trivial information like 'Server is runing on Port...' 
    - Data: display the message in light green, level 4: Used for display data from request.
  - SECRET_AUTH_JWT: Secret for Jwt generation

### How to run it.
- ```npm run start```

## The endpoints

We have this prefixes:
  - /Clients: for actions that can manage the clients
    - post /appointment [logged] -> Client create an appointment with 'pending' status
    - delete /appointment [logged] -> Client cancell the appointment
    - put /account [logged] -> Client modify the account data.
    - delete /account [logged] -> Client deactivate the account. Also cancel all the appointments without status 'done'
    - get /appointments [logged] -> Client visualize all of his appointments.
    - get /appointmentsbetweenDates [logged] -> Client visualize all of his appointments between the given dates.


  - /Dentist: for actions that can manage the Dentists
    - post /appointment [logged, mustBeDentist] -> Dentist create an appointment for a Client
    - put /appointment [logged, mustBeDentist] -> Dentist modify the info on the appointment
    - put /appointment/cancel [logged, mustBeDentist] -> Dentist Cancel the appointment
    - put /appointment/confirm [logged, mustBeDentist] -> Dentist Confirm an appointment
    - put /appointment/done [logged, mustBeDentist] -> Dentist end an appointment
    - delete /appointment [logged, mustBeDentist] -> Dentist Cancel the appointment
    - put /account [logged, mustBeDentist] -> Dentist edits his account
    - delete /account [logged, mustBeDentist] -> Dentist deactivate his account. Also cancell all of his appointments without status 'done'
    - get /appointments [logged, mustBeDentist] -> Dentist visualize all of his appointments
    - get /appointments/user [logged, mustBeDentist] -> Dentist visualize all the appointments from a Client
    - get /appointmentsbetweenDates [logged, mustBeDentist] -> Dentist visualize all of his appointments between the given dates.

  - /Admin: for actions that can manage the Admins
    - post /appointment [logged, mustBeAdmin] -> Admin create an appointment between a Dentist and a Client
    - delete /appointment [logged, mustBeAdmin] -> Admin cancel an appointment
    - put /appointment [logged, mustBeAdmin] -> Admin edit the appointment data
    - put /appointment/confirm [logged, mustBeAdmin] -> Admin confirm an appointment
    - put /appointment/done [logged, mustBeAdmin] -> Admin end and appointment
    - put /account [logged, mustBeAdmin] -> Admin edit his account
    - put /account/user [logged, mustBeAdmin] -> Admin edit other user account info
    - delete /account [logged, mustBeAdmin] -> Admin deactivate his account
    - put /roles/client [logged, mustBeAdmin] -> Admin change the given user role to Client
    - put /roles/dentist [logged, mustBeAdmin] -> Admin change the given user role to Dentist
    - put /roles/admin [logged, mustBeAdmin] -> Admin change the given user role to Admin
    - get /appointments/dentist [logged, mustBeAdmin] -> Admin visualize all the Dentist's appointments
    - get /appointments/Client [logged, mustBeAdmin] -> Admin visualize all the Clients's appointments
    - get /appointmentsbetweenDates [logged, mustBeAdmin] -> Admin visualize all of his appointments between the given dates.


### Things i will add

- A bloody swagger file
- Unit-Testing
- Refactor
