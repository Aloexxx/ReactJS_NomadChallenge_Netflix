import { useState } from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router";
import { searchMovies, searchTv } from "../api";
import { makeImagePath } from "../utils";

function Search(){
    const [more,setMore] = useState(true);
    const [moreTv,setMoreTv] = useState(true);
    const location = useLocation();
    const keyword = new URLSearchParams(location.search).get("keyword");
    const {data,isLoading} = useQuery(["movies","search"],()=>searchMovies(keyword||""));
    const {data:tvData,isLoading:loadingTv} = useQuery(["tv","search"],()=>searchTv(keyword||""));
    return(
        <>
        {isLoading||loadingTv?
            <p>Loading</p>
            :
        <div style={{marginTop:100}}>
            <p style={{fontSize:25,padding:10}}>movie</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)"}}>
                {more?
                <>
                    {data?data.results.slice(0,6).map((a:any,index:number)=>
                        <img src={`${makeImagePath(a.poster_path,"w500")}`} style={{width:200,height:200}}/>
                    )
                    :null}
                </>
                :
                <>
                    {data?data.results.map((a:any,index:number)=>
                        <img src={`${makeImagePath(a.poster_path,"w500")}`} style={{width:200,height:200}}/>
                    )
                    :null}
                </>
                }
            </div>
            <button onClick={()=>setMore((prev)=>!prev)}  style={{border:"none",width:100,height:50,borderRadius:10,margin:10}}>{more?"more":"fold"}</button>

            <p style={{fontSize:25,padding:10}}>tv</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)"}}>
                {moreTv?
                <>
                    {tvData?data.results.slice(0,6).map((a:any,index:number)=>
                        <img src={`${makeImagePath(a.poster_path,"w500")}`} style={{width:200,height:200}}/>
                    )
                    :null}
                </>
                :
                <>
                    {tvData?data.results.map((a:any,index:number)=>
                        <img src={`${makeImagePath(a.poster_path,"w500")}`} style={{width:200,height:200}}/>
                    )
                    :null}
                </>
                }
            </div>
            <button onClick={()=>setMoreTv((prev)=>!prev)} style={{border:"none",width:100,height:50,borderRadius:10,margin:10}}>{moreTv?"more":"fold"}</button>

        </div>
            }
            </>
    )
}

export default Search;