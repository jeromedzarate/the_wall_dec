import { validateFields } from "../helpers/global.helper";
import WallsModel from "../models/walls.model";

import Ejs from "ejs";
import Path from "path";

class UserController{
    constructor(){}

    /* Display the login or signup form */
    wallpage = async (req, res) => {
        if(req.session?.user?.user_id){
            let wallsModel = new WallsModel();  
            let fetch_wall_data = await wallsModel.fetchWallData();

            res.render("wallpage", { DATA: fetch_wall_data.result, USER_ID: req.session.user.user_id, USER_NAME: req.session.user.first_name });
        }
        else{
            res.redirect("/");
        }
    }

    /* Process the creating of message */
    createMessage = async (req, res) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            if(!req.session?.user?.user_id){
                throw Error("Please login");
            }

            let check_fields = validateFields(["message"], [], req);

            if(check_fields.status){
                let user_id = req.session.user.user_id;

                let wallsModel = new WallsModel();  
                let create_message_response = await wallsModel.createMessage({...check_fields.result, user_id});
                
                if(create_message_response.status){
                    response_data.status = create_message_response.status;

                    let {result: [fetch_message_data] } = await wallsModel.fetchMessage({ message_id: create_message_response.result.insertId });

                    response_data.html = await Ejs.renderFile(Path.join(__dirname, "../../views/partials/message.partial.ejs"), 
                        { message_data: {...fetch_message_data}, USER_ID: user_id }, { async: true });
                }
                else{
                    response_data = create_message_response;
                }
            }
            else{
                response_data = check_fields;
            }
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Encountered an error while creating wall message.";
        }

        res.json(response_data);
    }

    /* Process the creating of comment */
    createComment = async (req, res) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            if(!req.session?.user?.user_id){
                throw Error("Please login");
            }

            let check_fields = validateFields(["message_id", "comment"], [], req);

            if(check_fields.status){
                let user_id = req.session.user.user_id;

                let wallsModel = new WallsModel();  
                let create_comment_response = await wallsModel.createComment({ ...check_fields.result, user_id });
                
                if(create_comment_response.status){
                    response_data.status = create_comment_response.status;
                    response_data.result = { message_id: check_fields.result.message_id };

                    let { result: [fetch_comment_data] } = await wallsModel.fetchComment({ comment_id: create_comment_response.result.insertId });

                    response_data.html = await Ejs.renderFile(Path.join(__dirname, "../../views/partials/comment.partial.ejs"), 
                        { comment_data: { ...fetch_comment_data }, USER_ID: user_id }, { async: true });
                }
                else{
                    response_data = create_comment_response;
                }
            }
            else{
                response_data = check_fields;
            }
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Encountered an error while creating message comment.";
        }

        res.json(response_data);
    }

    /* Process the deleting of comment */
    deleteComment = async (req, res) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            if(!req.session?.user?.user_id){
                throw Error("Please login");
            }

            let check_fields = validateFields(["comment_id"], [], req);

            if(check_fields.status){
                let user_id = req.session.user.user_id;

                let wallsModel = new WallsModel();  
                let delete_comment_response = await wallsModel.deleteComment({ ...check_fields.result, user_id });
                
                if(delete_comment_response.status){
                    response_data.status = delete_comment_response.status;
                    response_data.result = { comment_id: check_fields.result.comment_id };
                }
                else{
                    response_data = delete_comment_response;
                }
            }
            else{
                response_data = check_fields;
            }
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Encountered an error while processing login data";
        }

        res.json(response_data);
    }

    /* Process the deleting of message */
    deleteMessage = async (req, res) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            if(!req.session?.user?.user_id){
                throw Error("Please login");
            }
            
            let check_fields = validateFields(["message_id"], [], req);

            if(check_fields.status){
                let user_id = req.session.user.user_id;

                let wallsModel = new WallsModel();  
                let delete_message_id = await wallsModel.deleteMessage({ ...check_fields.result, user_id });
                
                if(delete_message_id.status){
                    response_data.status = delete_message_id.status;
                    response_data.result = { message_id: check_fields.result.message_id };
                }
                else{
                    response_data = delete_message_id;
                }
            }
            else{
                response_data = check_fields;
            }
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Encountered an error while processing login data";
        }

        res.json(response_data);
    }
}

export default(function user(req, res){
    return new UserController(req, res);
})();