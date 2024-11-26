import './styles.css';

export default function Desc({name, data}: any) {
   return (
      <div className="DCContainer">
         <div className="DCText1">{name}</div>
         <div className="DCText2">{data}</div>
      </div>
   )
}