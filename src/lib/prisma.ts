import { PrismaClient, Goal as PrismaGoal, Plan as PrismaPlan, 
  User as PrismaUser, Project as PrismaProject,
  PromoCode as PrismaPromoCode
} from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

let prisma: PrismaClient

// if (process.env.NODE_ENV === 'production') {
//   prisma = new PrismaClient()
// } else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
// }

export default prisma
export type { Project } from '@prisma/client'

// 重新定义 Goal 类型
export interface Goal extends PrismaGoal {
  subGoals?: Goal[],
  parentGoal?: Goal
}

export interface Plan extends PrismaPlan {
  subPlans?: Plan[],
  parentPlan?: Plan,
  goal?: Goal
}

export interface User extends PrismaUser {
  
}

export interface PromoCode extends PrismaPromoCode {
  usedBy?: User
}
