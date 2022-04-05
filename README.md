Visual Database Schema: https://dbdesigner.page.link/WTZRbVeTR7EzLvs86

[Loom Video PT1](https://www.loom.com/share/4543abe4659540698c327058362f90f3)
[Loom Video PT2](https://www.loom.com/share/c4e8c8f38cb14fdb8ac43e6a2342f159)
[Loom Video PT3](https://www.loom.com/share/39128df605f44263b1b4a5b8ddbcddb3)
[Loom Video PT4](https://www.loom.com/share/7da5fc043d3149afb05876c28df9bd3d)

<p><b>*NOTE:</b> "schedules" as used in endpoints refer to <b>childrens'</b> <b>enrollments</b> to <b>courses</b>; "schedule" specific endpoints join the <b>children</b>, <b>enrollments</b>, and <b>courses</b> tables and return data matching the given <b>profile_id</b></p>

<h1>Profiles</h1>

```
{
  profile_id: INCREMENT (primary key, auto-increments, generated by database),
  okta_id: STRING (unique),
  name: STRING (required),
  email: STRING (required),
  role_id: INTEGER (required, foreign key),
  avatarUrl: STRING (required, defaults to: 'https://i.stack.imgur.com/frlIf.png'),
}
```

| Method   | URL                         | Description                                                                                                              |
| -------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| [GET]    | /profile/                   | Returns an array of all existing profiles.                                                                              |
| [GET]    | /profile/:okta_id/       | Returns the profile object with the specified `okta_id`.                                                                       |
| [GET]    | /profiles/users/:profile_id <b>(BUG: /profiles/users route does not exist; app.js only connects to /profiles/user)</b> | Returns an array filled with event objects that contains information based on profile_id and role_id.                    |
| [GET]    | /profile/role/:role_id <b>(BUG: does not return any data)</b>      | Returns an array filled with event objects that contain information based on role_id for all profiles of a role_id type. |
| [POST]   | /profile/                   | Requires a name, password, and email. Registers a new user.                                                              |
| [PUT]    | /profile/                   | Returns an event object with the specified `okta`. Updates specific profile.                                             |
| [DELETE] | /profile/:okta_id/             | Returns an event object with the specified `okta`. Deletes specific profile.                                             |
#### User:
<p>These endpoints are user-focused. As opposed to the more flexible Profile endpoints where <b>profile_id</b> must be specified, these endpoints retrieve data specific only to the user profile that is making the API request by using the logged-in user's <b>profile_id</b>.</p>

| Method | URL              | Description                                                             |
| ------ | ---------------- | ----------------------------------------------------------------------- |
| [GET]  | /user/           | Returns an event object with the specified `okta` and `type`.           |
| [GET]  | /user/inbox/     | Returns an event object with the specified `okta`. <b>(NOT IMPLEMENTED)</b>    |
| [GET]  | /user/schedules/ | Returns an event object with the specified `okta`.                      |
| [PUT]  | /user/           | Returns an event object with the specified `id`. Updates specific user. |

<h1>Parents</h1>

```
{
  parent_id: INCREMENT (primary key, auto-increments, generated by database),
  profile_id: INTEGER (required, foreign key),
}
```

| Method | URL                    | Description                                                         |
| ------ | ---------------------- | ------------------------------------------------------------------- |
| [GET]  | /parent/:profile_id/children/  | Returns an array filled with children event objects with the specified `profile_id`. |
| [GET]  | /parent/:profile_id/schedules/ | Returns an array filled with schedules event objects with the specified `profile_id`. |

<h1>Children</h1>

```
{
  child_id: INCREMENT (primary key, auto-increments, generated by database),
  profile_id: INTEGER (required, unique, foreign key),
  username: STRING (required),
  age: INTEGER (required),
  parent_id: INTEGER (required, foreign key),
}
```

| Method   | URL                       | Description                                                                        |
| -------- | ------------------------- | ---------------------------------------------------------------------------------- |
| [GET]    | /children                  | Returns an array containing all existing children.   
| [GET]    | /children/:id | Returns the child with the given 'id'.   
| [GET]    | /children/:id/enrollments | Returns an array filled with event objects with the specified `id`.                |
| [POST]   | /children/:id/enrollments | Returns the event object with the specified `id`. Enrolls a student.               |
| [PUT]    | /children/enrollments/    | Returns the event object with the specified `id`. Updates a student's enrollments. <b>(Not Implemented)</b>|
| [DELETE] | /children/enrollments/:id | Returns the event object with the specified `id`. Unenrolls student from course. <b>(Not Implemented)</b>|


<h1>Instructors</h1>

```
{
  instructor_id: INCREMENT (primary key, auto-increments, generated by database),
  rating: INTEGER (required),
  availability: STRING (optional),
  bio: STRING (required),
  profile_id: INTEGER (required, foreign key),
  status: STRING (required, default: 'pending'),
  approved_by: INTEGER (optional, foreign key, default: null, references admin_id),
}
```

| Method | URL                      | Description                                                         |
| ------ | ------------------------ | ------------------------------------------------------------------- |
| [GET]  | /instructor/:profile_id/courses/ | Returns an array filled with instructor event objects with the specified `profile_id`. <b>(BUG: does not return data)</b> |

<h1>Programs</h1>

```
{
  program_id: INCREMENT (primary key, auto-increments, generated by database),
  program_name: STRING (required, unique),
  program_description: STRING (required),
}
```

| Method   | URL          | Description                                                                                                  |
| -------- | ------------ | ------------------------------------------------------------------------------------------------------------ |
| [GET]    | /program/    | Returns an array filled with program objects.                                                                |
| [GET]    | /program/:id | Returns the program object with the specified `id`.                                                          |
| [POST]   | /program/    | Contains fields: `program_name` and `program_description`. Returns the newly created program object.         |
| [PUT]    | /program/:id | Updates the program with the specified `id` using data from the `request body`. Returns the modified program |
| [DELETE] | /program/:id | Removes the program with the specified `id` and returns deletion success message .                           |

<h1>Courses</h1>

```
{
  course_id: INCREMENT (primary key, auto-increments, generated by database),
  course_name: STRING (required),
  course_description: STRING (required),
  days_of_week: ARRAY[strings] (optional),
  max_size: INTEGER (required),
  min_age: INTEGER (required),
  max_age: INTEGER (required),
  instructor_id: INTEGER (required, foreign key),
  program_id: INTEGER (required, foreign key),
  start_time: TIME (required),
  end_time: TIME (required),
  start_date: DATE (required),
  end_date: DATE (required),
  location: STRING (required),
  number_of_sessions: INTEGER (required),
}
```

| Method   | URL                       | Description                                                                 |
| -------- | ------------------------- | --------------------------------------------------------------------------- |
| [GET]    | /course          | Returns an array containing all course objects                         |
| [GET]    | /course/:course_id | Returns the course object with the specified `course_id`.                           |
| [PUT]    | /course/:course_id | Updates and returns the updated course object with the specified `course_id`. |
| [DELETE] | /course/:course_id | Deletes the course object with the specified `course_id` and returns a message containing the deleted course_id on successful deletion   |

<h1>Newsfeed</h1>

```
{
  newsfeed_id: INCREMENT (primary key, auto-increments, generated by database),
  title: STRING (required),
  link: STRING (required),
  description: STRING (required),
  posted_at: TIMESTAMP (auto-generated),
}
```

| Method   | URL            | Description                                                                |
| -------- | -------------- | -------------------------------------------------------------------------- |
| [GET]    | /newsfeed/     | Returns an array containing all newsfeed objects.                                |
| [GET]    | /newsfeed/:newsfeed_id/ | Returns the event object with the specified `newsfeed_id`.                          |
| [POST]   | /newsfeed/     | Creates a new newsfeed object and returns the newly created newsfeed.     |
| [PUT]    | /newsfeed/:newsfeed_id     | Updates the newsfeed object with the given newsfeed_id and returns the newly updated newsfeed |
| [DELETE] | /newsfeed/:newsfeed_id/ | Deletes the newsfeed object with the given newsfeed_id and returns the deleted newsfeed. |

<h1>Inboxes</h1>

```
{
  inbox_id: INCREMENT (primary key, auto-increments, generated by database),
  profile_id: INTEGER (required, foreign key),
}
```

| Method   | URL              | Description                                                                              |
| -------- | ---------------- | ---------------------------------------------------------------------------------------- |
| [GET]    | /inbox/          | Returns an array filled with inbox event objects.                                              |
| [GET]    | /inbox/:profile_id/    | Retrieves an inbox with the specified inbox_id <b>BUG(?): incorrectly labeled as profile_id in codebase rather than inbox_id</b> |
| [POST]   | /inbox/          | Creates an inbox and returns the newly created inbox.                 |
| [POST]   | /inbox/messages/ | Returns the event object with the specified `inbox_id`. Sends a message.                 |
| [PUT]    | /inbox/:profile_id   | Returns an array filled with event objects with the specific `profile_id`. Updates an inbox.   |
| [DELETE] | /inbox/:profile_id/    | Returns an array filled with event objects with the specific `okta`. Deletes an inbox.   |


<h1>Schedule (Not Implemented)</h1>

| Method   | URL                 | Description                                                                  |
| -------- | ------------------- | ---------------------------------------------------------------------------- |
| [GET]    | /schedule/          | Returns an array filled with event objects.                                  |
| [GET]    | /schedule/:id/      | Returns the event object with the specified `id`.                            |
| [POST]   | /schedule/          | Returns the event object with the specified `id`. Creates a schedule.        |
| [POST]   | /schedule/sessions/ | Returns the event object with the specified `id`. Creates a session.         |
| [PUT]    | /schedule/          | Returns the event object with the specified `id`. Updates specific schedule. |
| [DELETE] | /schedule/:id/      | Returns the event object with the specified `id`. Deletes specific schedule. |


<h1>Data Tables Without Existing Endpoints</h1>

<h2>Super Admins</h2>

```
{
  super_admin_id: INCREMENT (primary key, auto-increments, generated by database),
  profile_id: INTEGER (required, foreign key),
}
```

<h2>Admins</h2>

```
{
  admin_id: INCREMENT (primary key, auto-increments, generated by database),
  profile_id: INTEGER (required, foreign key),
}
```

<h2>Messages</h2>

```
{
  messages_id: INCREMENT (primary key, auto-increments, generated by database),
  sent_at: TIMESTAMP (auto-generated),
  title: STRING (required),
  read: BOOLEAN (required, default: false),
  message: STRING (required),
  sent_by_profile_id: INTEGER (required, foreign key),
  inbox_id: INTEGER (required, foreign key,
}
```

<h2>Instructors' Program Types</h2>
<p><b>Join Table:</b> Programs instructors are approved to teach

```
{
  instructors_program_types_id: INCREMENT (primary key, auto-increments, generated by database),
  instructor_id: INTEGER (required, foreign key),
  program_id: INTEGER (required, foreign key),
}
```

<h2>Enrollments</h2>
<p><b>Join Table:</b> Courses signed up for by children

```
{
  enrollments_id: INCREMENT (primary key, auto-increments, generated by database),
  completed: BOOLEAN (required, default: false),
  child_id: INTEGER (required, foreign key),
  course_id: INTEGER (required, foreign key),
}
```

<h2>Resources</h2>

```
{
  resource_id: INCREMENT (primary key, auto-increments, generated by database),
  resource: STRING (required),
  description: STRING (optional),
  task: BOOLEAN (required),
  instructor_id: INTEGER (required, foreign key),
}
```

<br />
