import { NextResponse } from "next/server"

export function GET(request){
    const res ={success:true, message:`route working`}
    return NextResponse.json(res)
}

export function DELETE(request){
    console.log(`delete method called`)
    return NextResponse.json({success:true, message:`user deleted`})
}