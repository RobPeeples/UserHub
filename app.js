const BASE_URL = 'https://jsonplace-univclone.herokuapp.com';

const usersBaseUrl = `${BASE_URL}/users`


function fetchUsers() {
  return fetchData(usersBaseUrl);
};


function renderUser(user) {
  return $(`<div class="user-card">
    <header>
      <h2>${ user.name }</h2>
    </header>
    <section class="company-info">
      <p><b>Contact:</b> ${ user.email }</p>
      <p><b>Works for:</b> ${ user.company.name }</b></p>
      <p><b>Company creed:</b> "${ user.company.catchPhrase }, which will ${ user.company.bs }!"</p>
    </section>
    <footer>
      <button class="load-posts">POSTS BY ${ user.username }</button>
      <button class="load-albums">ALBUMS BY ${ user.username }</button>
    </footer>
  </div>`).data('user', user);
}

function renderUserList(userList) {
  //use looping and appending
  $('#user-list').empty();

  userList.forEach(function (users) {
    $('#user-list').append(renderUser(users));
  });
};

function fetchUserAlbumList(userId) {
  return fetchData(`${ BASE_URL }/users/${ userId }/albums?_expand=user&_embed=photos`);
 
}

/* render a single album */
function renderAlbum(album) {
  let individualAlbum = $(`<div class="album-card">
    <header>
      <h3>${ album.title }, by ${ album.user.username } </h3>
    </header>
    <section class="photo-list"></section>
    </div>`);

const photoListElement = individualAlbum.find('.photo-list');

album.photos.forEach(function (photo) {
  photoListElement.append( renderPhoto(photo) );
});

return individualAlbum;
}

/* render a single photo */
function renderPhoto(photo) {
  return $(`<div class="photo-card">
    <a href="${ photo.url }" target="_blank">
      <img src="${ photo.thumbnailUrl }" />
      <figure>${ photo.title }</figure>
    </a>
    </div>`);
}

/* render an array of albums */
function renderAlbumList(albumList) {
  $('#app section.active').removeClass('active');

  let albumListElement = $('#album-list');
    albumListElement.empty().addClass('active');

    albumList.forEach(function (album) {
    albumListElement.append( renderAlbum(album) );
  });  
}

function fetchUserPosts(userId) {
  return fetchData(`${ BASE_URL }/users/${ userId }/posts?_expand=user`);
}

function fetchPostComments(postId) {
  return fetchData(`${ BASE_URL }/posts/${ postId }/comments`);
}

function setCommentsOnPost(post) {
  // if we already have comments, don't fetch them again
  if (post.comments) {
    // #1: Something goes here
  }

  // fetch, upgrade the post object, then return it
  return fetchPostComments(post.id)
            .then(function (comments) {
    // #2: Something goes here
  });
}

function renderPost(post) {
  return $(`<div class="post-card">
    <header>
      <h3>${ post.title }</h3>
      <h3>--- ${ post.user.username }</h3>
    </header>
      <p>${ post.body }</p>
    <footer>
      <div class="comment-list"></div>
        <a href="#" class="toggle-comments">(<span class="verb">show</span> comments)</a>
    </footer>
    </div>`).data('post', post)
}

function renderPostList(postList) {
  $('#app section.active').removeClass('active');

  const postListElement = $('#post-list');
  postListElement.empty().addClass('active');

  postList.forEach(function (post) {
    postListElement.append( renderPost(post) );
  });
}

function toggleComments(postCardElement) {
  const footerElement = postCardElement.find('footer');

  if (footerElement.hasClass('comments-open')) {
    footerElement.removeClass('comments-open');
    footerElement.find('.verb').text('show');
  } else {
    footerElement.addClass('comments-open');
    footerElement.find('.verb').text('hide');
  }
}

function fetchData(url) {
  return fetch(url).then(function (res) {
    return res.json();// call json on the response, and return the result
  }).catch(function (error) {
    console.error(error);// use console.error to log out any error
  });
}

///////////////

$('#post-list').on('click', '.post-card .toggle-comments', function () {
  const postCardElement = $(this).closest('.post-card');
  const post = postCardElement.data('post');

  setCommentsOnPost(post)
    .then(function (post) {
      console.log('building comments for the first time...', post);
    })
    .catch(function () {
      console.log('comments previously existed, only toggling...', post);
    });
});

$('#user-list').on('click', '.user-card .load-posts', function () {
  const user = $(this).closest('.user-card').data('user');

  fetchUserPosts(user.id)
    .then(renderPostList);
});

$('#user-list').on('click', '.user-card .load-albums', function () {
  const user = $(this).closest('.user-card').data('user');

  fetchUserAlbumList(user.id)
    .then(renderAlbumList);

});




function bootstrap() {
  fetchUsers();// move the line about fetchUsers into here
}

bootstrap();

//////////////
fetchUsers().then(renderUserList);
fetchUserAlbumList().then(renderAlbumList);