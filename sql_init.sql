create database if not exists dashboardDB;

create table if not exists dashboardDB.stickyNotes (
  id int primary key auto_increment,
  title varchar(20),
  content varchar(100)
) charset 'utf8mb4';

insert ignore into dashboardDB.stickyNotes values (1, 'First file', 'Test');


create table if not exists dashboardDB.calendar (
  id varchar(5) primary key,
  selected_Date DATE,
  start_Hour TIME,
  end_Hour TIME,
  task varchar(100)
);

insert ignore into dashboardDB.calendar values(1, '2017-03-1', '10:30', '14:45', 'Test');
insert ignore into dashboardDB.calendar values(2, '2017-02-22', '09:30', '14:45', 'Second Test');
