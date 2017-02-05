

ConfigureRouter = function()
{
    Router.configure({
        layoutTemplate: "Main"
    });
    
    Router.route("/",{
        name:"Home",
        template:"Login"
    });
    
    Router.route("/Login",
    {
        name:"Login",
        template:"Login"
    });
    
    Router.route("/Register",
    {
        name:"Register",
        template:"Register"
    });
    
    Router.route("/Profile/:_id",{
        name:"Profile",
        template:"Profile",
        data: function()
        {
            
        }
    });
}
