import Mysql from "mysql";
import Bycrpt  from "bcryptjs";

import DatabaseModel from "./lib/database.model";
import UserHelper from "../helpers/users.helpers";

class UsersModel extends DatabaseModel{

    /* Function to insert new message data into the database */
    createMessage = async(params) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let create_message_query = Mysql.format(`
                INSERT INTO messages (user_id, message, created_at, updated_at) VALUES(?, ?, NOW(), NOW());
            `, [params.user_id, params.message]);

            response_data.result = await this.executeQuery(create_message_query);
            response_data.status = !!response_data.result.affectedRows;
            response_data.message = (!response_data.status) ? "Encountered an error while inserting message data." : "";
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Failed to insert message data.";
        }

        return response_data;
    }

    /* Function to fetch message data */
    fetchMessage = async(params) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let fetch_message_query = Mysql.format(`
                SELECT messages.id AS message_id, message AS content, DATE_FORMAT(messages.created_at, '%b %d, %Y at %T') AS posted_date,
                    users.id AS messenger_id, CONCAT(first_name, ' ', last_name) AS name
                FROM messages
                INNER JOIN users ON users.id = messages.user_id
                WHERE messages.id = ?;
            `, [params.message_id]);

            response_data.result = await this.executeQuery(fetch_message_query);
            response_data.status = !!response_data.result.length;
            response_data.message = (!response_data.status) ? "Encountered an error while fetching message data." : "";
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Failed to fetch message data.";
        }

        return response_data;
    }
    
    /* Function to insert new comment data into the database */
    createComment = async(params) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let create_comment_query = Mysql.format(`
                INSERT INTO comments (user_id, message_id, comment, created_at, updated_at) VALUES(?, ?, ?, NOW(), NOW());
            `, [params.user_id, params.message_id, params.comment]);

            response_data.result = await this.executeQuery(create_comment_query);
            response_data.status = !!response_data.result.affectedRows;
            response_data.message = (!response_data.status) ? "Encountered an error while inserting comment data." : "";
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Failed to insert comment data.";
        }

        return response_data;
    }

    /* Function to fetch comment data */
    fetchComment = async(params) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let fetch_comment_data = Mysql.format(`
                SELECT comments.id AS comment_id, comment AS content, DATE_FORMAT(comments.created_at, '%b %d, %Y at %T') AS posted_date,
                    users.id AS commenter_id, CONCAT(first_name, ' ', last_name) AS name
                FROM comments
                INNER JOIN users ON users.id = comments.user_id
                WHERE comments.id = ?;
            `, [params.comment_id]);

            response_data.result = await this.executeQuery(fetch_comment_data);
            response_data.status = !!response_data.result.length;
            response_data.message = (!response_data.status) ? "Encountered an error while fetching comment data." : "";
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Failed to fetch comment data.";
        }

        return response_data;
    }

    /* Function to fetch wall data(messages and comments) */
    fetchWallData = async(params) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let fetch_wall_data = Mysql.format(`
                SELECT messages.id AS message_id, message AS content, DATE_FORMAT(messages.created_at, '%b %d, %Y at %T') AS posted_date,
                    users.id AS messenger_id, CONCAT(first_name, ' ', last_name) AS name, comments.message_comments AS comments
                FROM messages
                INNER JOIN users ON users.id = messages.user_id
                LEFT JOIN (
                    SELECT comments.message_id,
                        JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'comment_id', comments.id, 
                                'content', comment, 
                                'posted_date', DATE_FORMAT(comments.created_at, '%b %d, %Y at %T'),
                                'commenter_id', users.id, 
                                'name', CONCAT(first_name, ' ', last_name)
                            )
                        ) AS message_comments
                    FROM comments
                    INNER JOIN users ON users.id = comments.user_id
                    GROUP BY comments.message_id
                ) AS comments ON comments.message_id = messages.id
                ORDER BY messages.created_at DESC;
            `, []);

            response_data.result = await this.executeQuery(fetch_wall_data);
            response_data.status = true;
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Failed to fetch comment data.";
        }

        return response_data;
    }

    /* Function to delete comment */
    deleteComment = async(params) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let delete_comment_query = Mysql.format(`
                DELETE FROM comments WHERE comments.id = ? AND user_id = ?;
            `, [params.comment_id, params.user_id]);

            response_data.result = await this.executeQuery(delete_comment_query);
            response_data.status = !!response_data.result.affectedRows;
            response_data.message = (!response_data.status) ? "Encountered an error while deleting comment data." : "";
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Failed to delete comment data.";
        }

        return response_data;
    }

    /* Function to delete message */
    deleteMessage = async(params) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let delete_message_query = Mysql.format(`DELETE FROM messages WHERE messages.id = ? AND user_id = ?; `, [params.message_id, params.user_id]);
            let delete_message_response = await this.executeQuery(delete_message_query);

            if(delete_message_response.affectedRows){
                let delete_comment_query = Mysql.format(`DELETE FROM comments WHERE comments.message_id = ?;`, [params.message_id]);
                let delete_comment_response = await this.executeQuery(delete_message_query);

            }
            response_data.status = !!delete_message_response.affectedRows;
            response_data.message = (!response_data.status) ? "Encountered an error while deleting message data." : "";
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Failed to delete message data.";
        }

        return response_data;
    }
}

export default UsersModel;