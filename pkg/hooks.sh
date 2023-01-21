
post_install() {
	(cd {{install.dir}} && find -type f ! -name "*.gz" -print0|xargs -0 gzip -k -9)
}

pre_upgrade() {
	(cd {{install.dir}} && find -type f -name "*.gz" -print0|xargs -0 rm)
}

post_upgrade() {
	(cd {{install.dir}} && find -type f ! -name "*.gz" -print0|xargs -0 gzip -k -9)
}

pre_remove() {
	(cd {{install.dir}} && find -type f -name "*.gz" -print0|xargs -0 rm)
}
