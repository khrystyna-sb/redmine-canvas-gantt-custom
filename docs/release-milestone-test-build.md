# Release milestone test build

Build `0.19.1.release.1` is based on upstream `v0.19.0` (`31a674c1f30919c2657e9d3d5f72f86bfb2dffc8`). See the [README](../README.md) for Git installation, updates, and rollback.

## Acceptance

- [ ] In Canvas Gantt, enable **Show version headers** and open a version with a release date. Check that its row shows a diamond and the native date at the corresponding day on the timeline.
- [ ] Collapse the version's issue rows. Check that the diamond and date remain visible.
- [ ] Hover over the marker and verify the version, owning project, date and status. Click it and verify that Redmine opens the version.
- [ ] Change the release date using a Redmine account with version editing permission. Refresh Canvas Gantt and verify that the diamond moves.
- [ ] Check that a version without a release date has no diamond, even if its issues have due dates.
- [ ] Zoom and scroll to a deadline outside the range of issue dates. Verify alignment with the timeline header.
- [ ] With a read-only account, verify that allowed versions have working links and a private project's restricted shared version is absent.
