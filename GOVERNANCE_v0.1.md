# Governance (v0.1) — Open Benchmark: Implementable Asset Pricing + Covariance Forecast Track

> 中文说明（简版）：本项目按“开放基准 + 多机构共建 + 非排他治理”设计。任何机构可作为 Founding Partner/节点参与，但项目不归属于任何单一机构。规则、评测与署名按公开治理流程执行。

## 1. Mission
Build a community-adopted common-task benchmark that bridges academic research and implementable quant practice via:
- standardized datasets/protocols,
- reproducible submissions (code-to-data / model-to-data),
- transparent evaluation metrics,
- a public leaderboard and versioned releases.

## 2. Scope
The Benchmark currently includes two tracks:
1) Implementable Asset Pricing Track (liquidity constraints & transaction costs)
2) Covariance Forecast Track (risk forecasting & calibration metrics)

## 3. Principles
- **Non-exclusive & multi-institutional**: multiple nodes/partners are welcome.
- **Reproducibility first**: every leaderboard entry must be reproducible in the official runner.
- **Temporal integrity**: no future information leakage; time-stamped availability rules.
- **Fairness & comparability**: standardized data, splits, and scoring.
- **Contribution-based credit**: no honorary authorship.

## 4. Roles
### 4.1 Founder / Founding Maintainer
- Owns and maintains the project’s core specifications, evaluation code, and release process.
- Chairs the Steering Committee and acts as tie-breaker when needed.

### 4.2 Maintainers
- Review and merge changes to code/specs.
- Maintain CI, runner compatibility, and documentation.

### 4.3 Steering Committee
Composition:
- Founder / Founding Maintainer
- Representatives from Founding Partners / nodes (e.g., Global host, Asia node)
Responsibilities:
- Approve rule/metric changes, data versioning, leaderboard policies, and partnerships.
Decision rule:
- Simple majority vote; tie-breaker by Founder.

### 4.4 Reviewers / Track Leads (optional)
- Provide technical review for track-specific changes and baselines.

## 5. Change Management (RFC Process)
Any material change must be proposed as an RFC (Request for Comments) via GitHub:
- Track definition changes
- Metrics or scoring pipeline changes
- Data schema/splits changes
- Submission interface changes
RFC steps:
1) Open an RFC issue with motivation, spec, and backward-compat plan
2) Public discussion window (>= 7 days unless urgent)
3) Maintainer review + Steering vote
4) Merge + release notes + version bump

## 6. Authorship & Credit (CRediT-style)
Benchmark/protocol papers and official reports follow contribution-based authorship:
- Conceptualization, Methodology, Software, Data Curation, Validation, Writing, Supervision, Funding Acquisition, etc.
Honorary authorship is not allowed.
Partners and advisors who provide guidance but not substantial contribution will be acknowledged.

## 7. IP & Licensing
- Code: MIT or Apache-2.0 (to be specified in LICENSE)
- Docs/specs: CC-BY 4.0 unless restricted by data licensing
- Data: distributed only if permitted; otherwise model-to-data is used and test data remains private.

## 8. Conflict of Interest
Steering members must disclose conflicts (e.g., competing benchmarks, commercial services tied to leaderboard outcomes).
When conflicted, members should abstain from votes on relevant decisions.

## 9. Security & Responsible Disclosure
- The runner executes untrusted code in a sandbox with network disabled and resource limits.
- Security issues should be reported privately to the maintainers (security@<domain> placeholder).

## 10. Succession & Continuity
- At least two backup maintainers must have admin access to the GitHub org and domain credentials.
- If the Founder steps down, the Steering Committee appoints a new Lead Maintainer.

## 11. Contact
- GitHub Issues: <repo url>
- Email: <contact email>
