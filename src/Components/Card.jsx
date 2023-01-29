function Card(prop){
    return(
      <>
     
          <div className='card'>
              <img className='cardImg' alt='pic' 
                  src={prop.imgsrc}
              />
              <div className='cardInfo'>
                  <span className='cardCat'>{prop.title}</span>
                  <h3 className='cardTitle'>{prop.sname}</h3>
                  <a target="_blank"
                  href='https://picsum.photos/'>
                      <button>wacth Now</button>
                  </a>
              </div>
          </div>
      
   </>
  
    )
  }
    export default Card;