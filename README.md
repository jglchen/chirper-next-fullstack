## Next.js Fullstack Emulating Laravel Chirper

[The Laravel Bootcamp](https://bootcamp.laravel.com/) demonstrates three different ways to build a microblogging platform called Chirper, [with Blade](https://bootcamp.laravel.com/blade/installation), [with Livewire](https://bootcamp.laravel.com/livewire/installation), and [with JavaScript and Inertia](https://bootcamp.laravel.com/inertia/installation).

This project is trying to <b>use Next.js full-stack functionalities emulating [the Laravel BootCamp Demonstration](https://bootcamp.laravel.com/)</b>.The Next.js React front pages are styled with Tailwind CSS to follow the Laravel BootCamp&apos;s view designs.In this project, Prisma as an ORM is used to manage the database, as Eloquent is adopted to connect Laravel with the database.

This project basically follows the ideas of demonstrations in the Laravel Bootcamp, and some additional features as below are added: 
- Chirper displays are loaded with scrolling pagination.
- Periodically update the Chirper display following the page is loaded.
- Mechanisms for users to follow and unfollow other users.
- The Laravel Bootcamp demonstrations provide a mechanism to send email notifications when a new Chirp is created to every other user, in this project we restrict the email notifications to the user&apos;s followers only.

### [View the App](https://chirper-next-fullstack.vercel.app)
### [App GitHub](https://github.com/jglchen/chirper-next-fullstack)
### Docker: docker run -p 3000:3000 jglchen/chirper-next-fullstack
