// Renders the comments
function renderComments(posts) {
  const hasComments = posts.length > 0;
  const postsList = document.createElement("ol");
  postsList.id = "posts-list";
  postsList.className = `hfeed${hasComments ? ' has-comments' : ''}`;

  const defaultMessage = document.createElement("li");
  defaultMessage.className = "no-comments";
  defaultMessage.textContent = "Be the first to share your food.";

  // Check if there are no comments
  if (!hasComments) {
    postsList.appendChild(defaultMessage);
  } else {
    // Create a comment card for each post
    posts.forEach(comment => {

      const thisPost = document.createElement("li");
      const postInfo = document.createElement("footer");
      postInfo.className = "post-info";

      const expirationDate = document.createElement("expirationDate");
      expirationDate.className = "published";
      expirationDate.textContent = "Expires " + new Date(comment.date).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });

      const name = document.createElement("address");
      name.innerHTML = comment.author;

      const contact = document.createElement("address");
      contact.innerHTML = comment.contact;
      const postId = document.createElement("address");
      postId.innerHTML = "post id: " + comment.id;

      postInfo.appendChild(expirationDate);
      postInfo.appendChild(name);
      postInfo.appendChild(contact);
      postInfo.appendChild(postId);

      const contentDiv = document.createElement("div");
      contentDiv.className = "contentDiv";
      contentDiv.innerHTML = `<p>${comment.comment}</p>`;

      const commentCard = document.createElement("div");
      commentCard.className = "comment-card";
      commentCard.appendChild(postInfo);
      commentCard.appendChild(contentDiv);

      thisPost.appendChild(commentCard);
      postsList.appendChild(thisPost);
    });
  }
  document.getElementById("comments-list").appendChild(postsList);
}

// Deletes a comment
function deleteComment(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(document.getElementById("commentform2")));
  fetch("/deleteComment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(res => res.json())
    .then(data => {
      console.log(data);
      location.reload();
    })
    .catch(error => console.error("Error:", error));
}

// Adds a comment
function addComment(event) {
  event.preventDefault();
  const form = document.getElementById("commentform");
  const data = Object.fromEntries(new FormData(form));

  fetch("/addComment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      location.reload();
    })
    .catch(err => console.error("Error:", err));

}