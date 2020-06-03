const config = {
    production : {
        SECRET : process.env.SECRET, 
        DATABASE : process.env.MONGODB_URI, 
        PORT : process.env.PORT, 
    }, 
    //delete default before pushing repository inorder to hide values
    default : {
        SECRET : "onedoesnotsimplylogintomorder", 
        DATABASE : "mongodb://localhost:27017/tgd_app", 
        PORT : 3000
    }
} 


exports.get = function get(env){
    return config[env] || config.default; 
}; 