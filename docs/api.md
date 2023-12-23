# Forum API Documentation

Welcome to the Forum API documentation! This API provides a platform for creating and managing discussion threads, comments, and interactions within a forum. Read on to learn about the available endpoints and how to use them.

---

## Table of Contents

1. [Authentication](#authentication)
2. [Endpoints](#endpoints)
    - [1. Threads](#1-threads)
    - [2. Comments](#2-comments)
    - [3. Replies](#3-replies)
3. [Response Status Codes](#response-status-codes)
4. [Error Handling](#error-handling)
5. [Conclusion](#conclusion)

## Authentication

To access protected endpoints, you need to include a valid JWT (JSON Web Token) in the Authorization header of your HTTP requests.

### Authentication Endpoint

- #### Register User

  - **URL:** `/users`
  - **Method:** `POST`
  - **Request:**

      ``` json
      {
        "username": "your_username",
        "password": "your_password",
        "fullname": "your_fullname"
      }
      ```

  - **Response**

    ```json
    {
        "status": "success",
        "message": "User added successfully",
        "data": {
            "userId": "user-id",
        }
    }
    ```

- #### Login

  - **URL:** `/authentications`
  - **Method:** `POST`
  - **Request:**

    ``` json
    {
      "username": "your_username",
      "password": "your_password"
    }
    ```

  - **Response**

    ```json
    {
        "status": "success",
        "message": "Authentication successfully add",
        "data": {
            "accessToken": "your_access_token",
            "refreshToken": "your_refresh_token",
        }
    }
    ```

#### Update Access token

- **URL:** `/authentications`
- **Method:** `PUT`
- **Request:**

  ``` json
  {
    "refreshToken": "your_refresh_token"
  }
  ```

- **Response**

    ```json
    {
        "status": "success",
        "message": "Access token successfully update",
        "data": {
            "accessToken": "your_access_token",
        }
    }
    ```

- #### Logout

  - **Method:** `DELETE`
  - **URL:** `/authentications`
  - **Request:**

    ``` json
    {
      "refreshToken": "your_refresh_token"
    }
    ```

  - **Response**

    ```json
    {
        "status": "success",
        "message": "Refresh token successfully delete"
    }
    ```

Use the received access token in the **Authorization header** of subsequent requests:

```bash
Authorization: Bearer <your_access_token>
```

## Endpoints

### 1. **Threads**

- #### Create New Thread

  - **Description**: Create a new discussion thread.
  - **URL:** `/threads`
  - **Method:** `POST`
  - **Request:**

    ``` json
      {
          "title": "your_thread_title",
          "body": "your_thread_body"
      }
    ```

  - **Response**

    ```json
    {
        "status": "success",
        "data": {
            "addedThread": {
                "id": "thread-h_W1Plfpj0TY7wyT2PUPX",
                "title": "a thread",
                "owner": "user-DWrT3pXe1hccYkV1eIAxS"
            }
        }
    }
    ```

- #### Get Thread

  - **Description**: Create a new discussion thread.
  - **URL:** `/threads/{id}`
  - **Method:** `GET`
  - **Response**

    ```json
    {
        "status": "success",
        "data": {
            "thread": {
                "id": "thread-PJByal62zobLFhUggQo2m",
                "title": "a thread",
                "body": "a body thread",
                "date": "2023-12-23T05:23:12.994Z",
                "username": "username",
                "comments": [
                    {
                        "id": "comment-6ptWTV9l16szB-kTKWvy_",
                        "username": "username",
                        "date": "2023-12-23T05:23:15.994Z",
                        "content": "a comment",
                        "likeCount": 2,
                        "replies": [
                            {
                                "id": "reply-BErOXUSefjwWGW1Z10Ihk",
                                "content": "**balasan telah dihapus**",
                                "date": "2023-12-23T05:23:25.994Z",
                                "username": "username"
                            },
                            {
                                "id": "reply-xNBtm9HPR-492AeiimpfN",
                                 "content": "a reply",
                                 "date": "2023-12-23T05:23:23.994Z",
                                "username": "username"
                            }
                        ],
                    },
                    {
                        "id": "comment-_KSz7hz-ox__kqTtCjslD",
                        "username": "username",
                        "date": "2023-12-23T05:23:13.994Z",
                        "content": "**komentar telah dihapus**",
                        "likeCount": 1,
                        "replies": []
                    }
                ]
            }
        }
    }
    ```

### 2. **Comments**

- #### Create New Comment

  - **Description**: Create a new comment in the thread.
  - **URL:** `/threads/{id}/comments`
  - **Method:** `POST`
  - **Request:**

    ``` json
      {
          "content": "your_content"
      }
    ```

  - **Response**

    ```json
    {
        "status": "success",
        "data": {
            "addedComment": {
                "id": "comment-_pby2_tmXV6bcvcdev8xk",
                "content": "a comment",
                "owner": "user-CrkY5iAgOdMqv36bIvys2"
            }
        }
    }
    ```

- #### Delete Comment

  - **Description**: Delete existing comment in the thread.
  - **URL:** `/threads/{threadId}/comments{commentId}`
  - **Method:** `DELETE`
  - **Response**

    ```json
    {
        "status": "success"
    }
    ```

- #### Like Comments

  - **Description**: Add Like to existing comment in the thread.
  - **URL:** `/threads/{threadId}/comments{commentId}/likes`
  - **Method:** `PUT`
  - **Response**

    ```json
    {
        "status": "success"
    }
    ```

### 3. **Replies**

- #### Create New Reply

  - **Description**: Create a new reply on the comment.
  - **URL:** `/threads/{threadId}/comments/{commentId}/replies`
  - **Method:** `POST`
  - **Request:**

    ``` json
      {
          "content": "your_content"
      }
    ```

  - **Response**

    ```json
    {
        "status": "success",
        "data": {
            "addedReply": {
                "id": "reply-_pby2_tmXV6bcvcdev8xk",
                "content": "a reply",
                "owner": "user-CrkY5iAgOdMqv36bIvys2"
            }
        }
    }
    ```

- #### Delete Reply

  - **Description**: Delete existing reply on the comment.
  - **URL:** `/threads/{threadId}/comments{commentId}/replies/{repliesId}`
  - **Method:** `DELETE`
  - **Response**

    ```json
    {
        "status": "success"
    }
    ```

## Response Status Codes

- `200 OK`: Successful operation.
- `201 Created`: Resource created successfully.
- `400 Bad Request`: Malformed request or invalid parameters.
- `401 Unauthorized`: Missing or invalid authentication token.
- `403 Forbidden`: Do not have permission to access resource.
- `404 Not Found`: Resource not found.
- `500 Internal Server Error`: Unexpected server error.

## Error Handling

```json
{
    "status": "fail",
    "message": "Additional message about the error"
}
```

## Conclusion

This concludes the documentation for the Forum API. If you have any questions or need further assistance, feel free to reach out.

---

Happy coding!
