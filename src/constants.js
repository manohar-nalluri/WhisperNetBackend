export const accessCookieOptions = {
        maxAge: 1000 * 60 * 1440,
        httpOnly: true, 
        // signed: true,
        sameSite: 'None',
        secure:true,
        domain:".ondigitalocean.app"
    }
export const refreshCookieOption = {
  maxAge:1000 * 60 * 1440 * 10,
  httpOnly:true,
  sameSite: 'None',
  secure:true,
  domain:".ondigitalocean.app"
}

export const status=Object.freeze({
  TODO:"To do",
  IN_PROGRESS:"In Progress",
  UNDER_REVIEW:"Under Review",
  COMPLETED:"Completed"
})

export const taskPriority=Object.freeze({
  URGENT:"Urgent",
  MEDIUM:"Medium",
  LOW:"Low",
  NONE:"None"
})
