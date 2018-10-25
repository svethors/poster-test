
export class App {
    
    

    constructor() {
        this.userIdMap = [];
    }


    loadUsers = () => {
        const userQuery = db.collection("users");
        userQuery.onSnapshot(function(snapshot) {
            snapshot.docChanges().forEach(function(change) {
                if (!snapshot.size) {
                   return;
                }
                
                if (change.type === 'added') {
                    const user = change.doc.data();

                    this.userIdMap[user.id] = user.email;

                    renderUser(user);
                }
            });
        });
    }

    renderUsers(users) {
        users.forEach(function(user) {
            renderUser(user.data());
        });
    }

    renderUser(user) {
        const userListDiv = document.getElementById("userList");

        const userDiv = document.createElement("div");
        userDiv.id = user.id;

        const emailDiv = document.createElement("div");
        emailDiv.textContent = user.email;

        userDiv.appendChild(emailDiv);

        userListDiv.appendChild(userDiv);
    }

    loadPosts() {
        const postsQuery = db.collection("posts")
        .orderBy('timestamp', 'asc');

        postsQuery.onSnapshot(function(snapshot) {
            snapshot.docChanges().forEach(function(change) {
                if(!snapshot.size) {
                    return;
                }

                if (change.type === 'added') {
                    renderPost(change.doc.data());
                }
            });
        });
    }

    renderPost(post) {
        const postListElement = document.getElementById("postList");
        const postDiv = document.createElement("div");
        postDiv.classList.add("post-frame");
        
        const postedBySpan = document.createElement("span");
        postedBySpan.classList.add("post-by");
        postedBySpan.textContent = userIdMap[post.postedBy];

        const timestampSpan = document.createElement("span");
        timestampSpan.classList.add("post-timestamp");
        timestampSpan.textContent = new Date(post.timestamp);
        
        const textSpan = document.createElement("span");
        textSpan.classList.add("post-text");
        textSpan.textContent = post.text;
        
        postDiv.appendChild(postedBySpan);
        postDiv.appendChild(timestampSpan);
        postDiv.appendChild(document.createElement("br"));
        postDiv.appendChild(textSpan);
        postListElement.appendChild(postDiv);
    }

    start() {

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                let user = firebase.auth().currentUser;

                document.getElementById("email").innerHTML = user.email;
                
                const usersColl = db.collection("users");

                const userDocRef = usersColl.doc(user.uid);
                userDocRef.get()
                .then(function(doc) {
                        userDocRef.set({
                            id: user.uid,
                            email: user.email,
                            status: 1
                        })
                        .catch(function(error) {
                            console.log(error);
                            return error;    
                        });
                    
                }).catch(function(error) {
                    console.log(error);
                    return error;    
                });
            } else {
                // No user is signed in.
            }
        });

        document.getElementById("formNewPost").addEventListener('submit', function(form) {
            form.preventDefault();
            let text = document.getElementById("txtNewPost").value;

            let db = firebase.firestore();

            let post  = {
                timestamp: moment.utc().valueOf(),
                postedBy: firebase.auth().currentUser.uid,
                text: text
            }

            db.collection("posts").add(post)
            .then(function(docRef) {
                console.log(docRef);
                console.log(docRef.id);
                
                post.id = docRef.id;
                document.getElementById("txtNewPost").value = "";
                //renderPost(post);
            })
            .catch(function(error) {
                console.log(error);
                return error;
            });
        });

        this.loadUsers();
        this.loadPosts();
    }
}

let app = new App();
app.start();