# Book Club

> **Note:** WIP. This is a learn-by-doing project to play with Gatsby and Firebase

## Synopsis

This is a toy Book Club web app bootstrapped with Gatsby's default starter.

Functionality implemented (so far):

- Login / Register user using Firebase authentication
- List all books in database in the home page (no pagination yet)
- Admin user role (only admins are allowed to add authors and books)
- Upload book cover images to Firebase storage, render appropriately sized image to page using Gatsby image
- Realtime comments using Firebase cloud functions

This project uses the following technologies:

- React
- GraphQL
- Gatsby
- Firebase (authentication, database, storage, cloud functions)
- Styled-components

## To Do

- [ ] Deploy to Netlify
- [ ] Pagination
- [ ] Add client-side GraphQL with Apollo Client (specifically for books subscription), or
- [ ] Auto-rebuild when new books are added (requires paid Netlify account?)
