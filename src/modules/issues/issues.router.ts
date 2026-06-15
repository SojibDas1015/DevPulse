import { Router } from "express";
import { issuesController } from "./issues.controller";
import { role } from "../../role";
import { authentication } from "../../middleware/authentication";

const router = Router()

router.post('/', authentication.createIssues(role.contributor, role.maintainer), issuesController.createIssues)
router.get('/', issuesController.getAllIssues)
router.get('/:id', issuesController.getSingleIssues)
router.patch('/:id',authentication.authUpdate(role.contributor, role.maintainer) , issuesController.updateIssue)
router.delete('/:id', authentication.authDeleteIssues(role.maintainer), issuesController.issuesDelete)



export const issues = router