import React from "react";
import Carousal from "./Carousel";


function Footer(){
    return(
        <>
            <section className="footerDiv">
  <div className="row footerSec">
  <div className="col-lg-3 col-12 mb-5 ">
    <h2>Fugu</h2>
    <p>Discover NFTs by category, track the latest drops, and follow the collections you love to enjoy it!</p>
  
    <div className="socialDiv">
       <a><i className="fab fa-facebook-f"></i></a>
       <a><i className="fab fa-instagram"></i></a>
       <a><i className="fab fa-twitter"></i></a>
       <a><i className="fab fa-linkedin-in"></i></a>
       
   
    </div>
  </div>


  <div className="col-lg-3 col-12">
    <h2>Marketplace</h2>
    
    <ul>
    <li> <a>Create A Store</a></li> 
    <li> <a>Start Selling</a></li>
    <li> <a>My Account</a></li>
    <li> <a>Job</a></li> 
    <li> <a> List a Item</a></li>
    </ul>
  </div>

  <div className="col-lg-3 col-12 ">
    <h2>Marketplace</h2>
    
    <ul>
    <li> <a> Art</a></li>
    <li> <a>Digital Art</a></li>
    <li> <a>Photography</a></li>
    <li> <a>Games</a></li> 
    <li> <a>Music</a></li>
    </ul>
  </div>

<div className="col-lg-3 col-12 ">
  <h2>Marketplace</h2>
<ul>
<li> <a>Explore NFTs   </a></li>  
<li> <a>Platform Status</a></li>  
<li> <a>Help center    </a></li>  
<li> <a>Partners       </a></li>  
<li> <a>Marketplace    </a></li>  
</ul>

</div>

  </div>
</section>
                <footer>
                <div className="row">
                  <div className="col-lg-8 col-12 text-start  text-muted">
                  <p className=" mt-2">© Copyright 2022, All Rights Reserved by Mthemeus</p>
                  </div>
                  {/* <div className="col-lg-4 col-12 text-center"><a>Privacy Policy</a>
                  <a>Terms</a></div> */}
                </div>
              
                </footer>
                
        </>
    )
}
export default Footer;