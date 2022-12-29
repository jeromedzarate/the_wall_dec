$(document).ready(function(){
    $("body")
        .on("submit", "#create_message_form", createMessage)
        .on("submit", ".create_comment_form", createComment)
        .on("submit", ".delete_comment_form", deleteComment)
        .on("submit", ".delete_message_form", deleteMessage)
        .on("submit", "#logout_form", logout);
});

/* Request for creating message */
function createMessage(){
    let create_message_form = $(this);

    if(parseInt(create_message_form.attr("data-is_processing")) === 0){
        create_message_form.attr("data-is_processing", 1);

        $.post(create_message_form.attr("action"), create_message_form.serialize(), function(create_message_response){
            if(create_message_response.status){
                $(".messages_container").prepend(create_message_response.html);
            }
            else{
                alert(create_message_response.message);
            }
        });

        create_message_form.attr("data-is_processing", 0);
    }

    return false;
}

/* Request for creating comment */
function createComment(){
    let create_comment_form = $(this);

    if(parseInt(create_comment_form.attr("data-is_processing")) === 0){
        create_comment_form.attr("data-is_processing", 1);

        $.post(create_comment_form.attr("action"), create_comment_form.serialize(), function(create_comment_response){
            if(create_comment_response.status){
                let message_container = $(`.message_${ create_comment_response.result.message_id }`);

                message_container.find(".comments_container").append(create_comment_response.html);
            }
            else{
                alert(create_comment_response.message);
            }
        });

        create_comment_form.attr("data-is_processing", 0);
    }

    return false;
}

/* Request for deleting comment */
function deleteComment(){
    let delete_comment_form = $(this);

    if(parseInt(delete_comment_form.attr("data-is_processing")) === 0){
        delete_comment_form.attr("data-is_processing", 1);

        $.post(delete_comment_form.attr("action"), delete_comment_form.serialize(), function(delete_comment_response){
            if(delete_comment_response.status){
                $(`.comment_${ delete_comment_response.result.comment_id }`).remove();
            }
            else{
                alert(delete_comment_response.message);
            }
        });

        delete_comment_form.attr("data-is_processing", 0);
    }

    return false;
}

/* Request for deleting message */
function deleteMessage(){
    let delete_message_form = $(this);

    if(parseInt(delete_message_form.attr("data-is_processing")) === 0){
        delete_message_form.attr("data-is_processing", 1);

        $.post(delete_message_form.attr("action"), delete_message_form.serialize(), function(delete_message_response){
            if(delete_message_response.status){
                $(`.message_${ delete_message_response.result.message_id }`).remove();
            }
            else{
                alert(delete_message_response.message);
            }
        });

        delete_message_form.attr("data-is_processing", 0);
    }

    return false;
}

/* Request for user logout */
function logout(){
    let logout_form = $(this);

    if(parseInt(logout_form.attr("data-is_processing")) === 0){
        logout_form.attr("data-is_processing", 1);

        $.post(logout_form.attr("action"), logout_form.serialize(), function(logout_response){
            if(logout_response.status){
               window.location.href = "/"
            }
            else{
                alert(logout_response.message);
            }
        });

        logout_form.attr("data-is_processing", 0);
    }

    return false;
}