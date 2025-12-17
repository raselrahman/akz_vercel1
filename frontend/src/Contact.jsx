export  default function Contact(){
    return(
    <>
    <h1>This is a Contact Page</h1>
    <form>
        <label>Name</label>
        <input type="text" placeholder="Enter your name"/><br/>
        <label>Email</label>
        <input type="email" placeholder="Enter your email"/><br/>
        <label>Phone</label>
        <input type="text" placeholder="Enter your phone"/><br/>
        
        <button type="submit" style={{ padding: "8px 7px", background: "#007bff" }}>Submit</button>
    </form>
    </>
    );
}