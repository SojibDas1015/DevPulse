import { Router } from "express";
import { issuesController } from "./issues.controller";
import { role } from "../../role";
import authentication from "../../middleware/authentication";

const router = Router()

router.post('/',authentication(role.contributor, role.maintainer), issuesController.createIssues)
router.get('/', issuesController.getAllIssues)
router.get('/:id', issuesController.getSingleIssues)
router.patch('/:id', issuesController.updateIssue)
router.delete('/:id', issuesController.issuesDelete)



export const issues = router